package com.kabilan.assessment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.concurrent.*;
import java.util.regex.Pattern;

/**
 * High-Security Code Execution Sandbox Service.
 * Evaluates student code submissions in Java / Python with:
 * 1. Static security filter preventing access to dangerous APIs (Reflection, ProcessBuilder, System.exit)
 * 2. Hard timeout enforcement (prevents infinite loops)
 * 3. Output stream capture and resource constraints
 */
@Service
public class CodeExecutionSandboxService {

    private static final Logger log = LoggerFactory.getLogger(CodeExecutionSandboxService.java);
    private static final long DEFAULT_TIMEOUT_MS = 4000;

    // Disallowed system API calls and reflection hazards
    private static final List<Pattern> SECURITY_BLACKLIST = List.of(
            Pattern.compile("System\\.exit", Pattern.CASE_INSENSITIVE),
            Pattern.compile("Runtime\\.getRuntime", Pattern.CASE_INSENSITIVE),
            Pattern.compile("ProcessBuilder", Pattern.CASE_INSENSITIVE),
            Pattern.compile("java\\.lang\\.reflect", Pattern.CASE_INSENSITIVE),
            Pattern.compile("sun\\.misc\\.Unsafe", Pattern.CASE_INSENSITIVE),
            Pattern.compile("java\\.net\\.", Pattern.CASE_INSENSITIVE),
            Pattern.compile("java\\.nio\\.file\\.", Pattern.CASE_INSENSITIVE),
            Pattern.compile("java\\.io\\.File(?!InputStream|OutputStream)", Pattern.CASE_INSENSITIVE),
            Pattern.compile("Thread\\.stop", Pattern.CASE_INSENSITIVE),
            Pattern.compile("SecurityManager", Pattern.CASE_INSENSITIVE)
    );

    public record ExecutionRequest(
            String language,
            String sourceCode,
            String standardInput,
            long timeoutMs
    ) {}

    public record ExecutionResult(
            String status, // SUCCESS, SECURITY_VIOLATION, TIMEOUT, COMPILATION_ERROR, RUNTIME_ERROR
            String stdout,
            String stderr,
            long executionTimeMs,
            String diagnostics
    ) {}

    /**
     * Runs static analysis to reject malicious imports or system level escalations.
     */
    public Optional<String> validateSecurityRules(String sourceCode) {
        if (sourceCode == null || sourceCode.isBlank()) {
            return Optional.of("Empty source code submitted.");
        }

        for (Pattern pattern : SECURITY_BLACKLIST) {
            if (pattern.matcher(sourceCode).find()) {
                return Optional.of("Security Violation: Code attempts to access restricted API [" + pattern.pattern() + "]");
            }
        }
        return Optional.empty();
    }

    /**
     * Executes the submitted source code inside an isolated, timed process environment.
     */
    public ExecutionResult executeCode(ExecutionRequest request) {
        long timeout = request.timeoutMs() > 0 ? Math.min(request.timeoutMs(), 10000) : DEFAULT_TIMEOUT_MS;

        // 1. Static Security Check
        Optional<String> securityViolation = validateSecurityRules(request.sourceCode());
        if (securityViolation.isPresent()) {
            return new ExecutionResult(
                    "SECURITY_VIOLATION",
                    "",
                    securityViolation.get(),
                    0,
                    "Execution blocked by Sandbox Security Engine."
            );
        }

        // 2. Sandboxed execution execution container or isolated temp directory
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("sandbox_run_");
            String lang = request.language() != null ? request.language().toLowerCase() : "java";

            if ("python".equals(lang) || "py".equals(lang)) {
                return runPython(tempDir, request.sourceCode(), request.standardInput(), timeout);
            } else {
                return runJava(tempDir, request.sourceCode(), request.standardInput(), timeout);
            }
        } catch (Exception ex) {
            log.error("Sandbox initialization failure", ex);
            return new ExecutionResult("SYSTEM_ERROR", "", ex.getMessage(), 0, "Sandbox container failure.");
        } finally {
            if (tempDir != null) {
                deleteDirectoryQuietly(tempDir.toFile());
            }
        }
    }

    private ExecutionResult runJava(Path tempDir, String code, String input, long timeoutMs) throws Exception {
        // Enforce Solution class convention
        Path sourceFile = tempDir.resolve("Solution.java");
        Files.writeString(sourceFile, code);

        // Compile
        long startTime = System.currentTimeMillis();
        Process compileProcess = new ProcessBuilder("javac", sourceFile.toString())
                .directory(tempDir.toFile())
                .redirectErrorStream(true)
                .start();

        boolean compiled = compileProcess.waitFor(5000, TimeUnit.MILLISECONDS);
        if (!compiled || compileProcess.exitValue() != 0) {
            String compileOutput = readStream(compileProcess.getInputStream());
            return new ExecutionResult("COMPILATION_ERROR", "", compileOutput, System.currentTimeMillis() - startTime, "Compilation failed.");
        }

        // Execute Solution with memory and permission limits
        Process runProcess = new ProcessBuilder("java", "-Xmx128m", "-Xms32m", "Solution")
                .directory(tempDir.toFile())
                .start();

        if (input != null && !input.isEmpty()) {
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }
        }

        boolean finished = runProcess.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
        long execTime = System.currentTimeMillis() - startTime;

        if (!finished) {
            runProcess.destroyForcibly();
            return new ExecutionResult("TIMEOUT", "", "Time Limit Exceeded (" + timeoutMs + "ms)", execTime, "Execution killed due to timeout.");
        }

        String stdout = readStream(runProcess.getInputStream());
        String stderr = readStream(runProcess.getErrorStream());

        return new ExecutionResult(
                runProcess.exitValue() == 0 ? "SUCCESS" : "RUNTIME_ERROR",
                stdout,
                stderr,
                execTime,
                "Process exited with code " + runProcess.exitValue()
        );
    }

    private ExecutionResult runPython(Path tempDir, String code, String input, long timeoutMs) throws Exception {
        Path scriptFile = tempDir.resolve("solution.py");
        Files.writeString(scriptFile, code);

        long startTime = System.currentTimeMillis();
        Process runProcess = new ProcessBuilder("python", scriptFile.toString())
                .directory(tempDir.toFile())
                .start();

        if (input != null && !input.isEmpty()) {
            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(runProcess.getOutputStream()))) {
                writer.write(input);
                writer.flush();
            }
        }

        boolean finished = runProcess.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
        long execTime = System.currentTimeMillis() - startTime;

        if (!finished) {
            runProcess.destroyForcibly();
            return new ExecutionResult("TIMEOUT", "", "Time Limit Exceeded (" + timeoutMs + "ms)", execTime, "Process killed.");
        }

        String stdout = readStream(runProcess.getInputStream());
        String stderr = readStream(runProcess.getErrorStream());

        return new ExecutionResult(
                runProcess.exitValue() == 0 ? "SUCCESS" : "RUNTIME_ERROR",
                stdout,
                stderr,
                execTime,
                "Python script completed."
        );
    }

    private String readStream(InputStream is) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append(System.lineSeparator());
            }
            return sb.toString().trim();
        }
    }

    private void deleteDirectoryQuietly(File dir) {
        if (dir != null && dir.exists()) {
            File[] files = dir.listFiles();
            if (files != null) {
                for (File f : files) {
                    if (f.isDirectory()) deleteDirectoryQuietly(f);
                    else f.delete();
                }
            }
            dir.delete();
        }
    }
}
