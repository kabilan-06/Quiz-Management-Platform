import React, { useState } from "react";
import axios from "axios";

const QuestionForm = ({ quizzes }) => {
  const [quizId, setQuizId] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] = useState("MULTIPLE_CHOICE");
  const [questionMedia, setQuestionMedia] = useState({ image: null, audio: null, video: null });
  const [options, setOptions] = useState([
    { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
    { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
    { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
    { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleOptionChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  // Handle media upload for question
  const handleQuestionMediaChange = (type, file) => {
    setQuestionMedia((prev) => ({ ...prev, [type]: file }));
  };

  // Handle media upload for options
  const handleOptionMediaChange = (index, type, file) => {
    const updatedOptions = [...options];
    updatedOptions[index][type] = file;
    setOptions(updatedOptions);
  };

  // For matching type: handle matchText change
  const handleMatchChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index].matchText = value;
    setOptions(updatedOptions);
  };

  const handleCorrectChange = (index) => {
    if (questionType === "MULTIPLE_CHOICE" || questionType === "POLL") {
      const updatedOptions = options.map((opt, i) => ({
        ...opt,
        correct: i === index,
      }));
      setOptions(updatedOptions);
    } else if (questionType === "MATCHING") {
      // No correct toggle for matching, handled by matchText
      return;
    } else {
      const updatedOptions = [...options];
      updatedOptions[index].correct = !updatedOptions[index].correct;
      setOptions(updatedOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quizId) {
      setMessage({ text: "Please select a quiz first!", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    try {
      // For demonstration, just add media file names (in real app, upload to server or cloud storage)
      const payload = {
        questionText,
        questionType,
        options: options.map(opt => ({
          ...opt,
          image: opt.image ? opt.image.name : null,
          audio: opt.audio ? opt.audio.name : null,
          video: opt.video ? opt.video.name : null
        })),
        image: questionMedia.image ? questionMedia.image.name : null,
        audio: questionMedia.audio ? questionMedia.audio.name : null,
        video: questionMedia.video ? questionMedia.video.name : null
      };
      await axios.post(
        `https://quiz-management-platform.onrender.com/api/quizzes/${quizId}/questions`,
        payload
      );
      setMessage({ text: "Question added successfully!", type: "success" });
      setQuestionText("");
      setOptions([
        { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
        { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
        { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
        { optionText: "", correct: false, matchText: "", image: null, audio: null, video: null },
      ]);
      setQuestionMedia({ image: null, audio: null, video: null });
    } catch (error) {
      console.error(error);
      setMessage({ text: "Failed to add question. Please check your connection.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const role = localStorage.getItem("role");
  if (role !== "ADMIN") {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(229, 62, 62, 0.1), rgba(229, 62, 62, 0.05))',
          padding: '2rem',
          borderRadius: 'var(--border-radius)',
          border: '2px solid var(--error-color)',
          color: 'var(--error-color)'
        }}>
          <h3>Access Denied</h3>
          <p>Only administrators can add questions.</p>
        </div>
      </div>
    );
  }

  const containerStyle = {
    maxWidth: '700px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    color: 'var(--secondary-color)',
    opacity: 0.8
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: 'var(--primary-color)'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    transition: 'var(--transition)',
    background: 'white'
  };

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer'
  };

  const optionRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
    borderRadius: 'var(--border-radius)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    accentColor: 'var(--accent-color)'
  };

  const buttonStyle = {
    background: 'var(--gradient-primary)',
    color: 'white',
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: 'var(--border-radius)',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'var(--transition)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    marginTop: '1rem'
  };

  return (
    <div style={containerStyle} className="fade-in">
      <div style={headerStyle}>
        <h2 style={titleStyle}>Add Question</h2>
        <p style={subtitleStyle}>Create engaging questions for your quiz</p>
      </div>

      {message.text && (
        <div className={message.type === "error" ? "error" : "success"} style={{ marginBottom: '1.5rem' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div>
          <label style={labelStyle}>Select Quiz</label>
          <select
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            style={selectStyle}
            required
          >
            <option value="">-- Select a Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Question Text</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter your question here"
            style={inputStyle}
            required
          />
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            <label>
              <span style={{ fontSize: '0.9rem' }}>Image</span>
              <input type="file" accept="image/*" onChange={e => handleQuestionMediaChange('image', e.target.files[0])} />
            </label>
            <label>
              <span style={{ fontSize: '0.9rem' }}>Audio</span>
              <input type="file" accept="audio/*" onChange={e => handleQuestionMediaChange('audio', e.target.files[0])} />
            </label>
            <label>
              <span style={{ fontSize: '0.9rem' }}>Video</span>
              <input type="file" accept="video/*" onChange={e => handleQuestionMediaChange('video', e.target.files[0])} />
            </label>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Question Type</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            style={selectStyle}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="FILL_IN_THE_BLANK">Fill in the Blank</option>
            <option value="POLL">Poll</option>
            <option value="MATCHING">Matching</option>
          </select>
        </div>

        {/* Dynamic answer options based on question type */}
        {questionType !== "FILL_IN_THE_BLANK" && (
          <div>
            <label style={labelStyle}>Answer Options</label>
            {options.map((option, index) => (
              <div key={index} style={optionRowStyle} className="slide-in">
                <input
                  type="text"
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(index, "optionText", e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                  style={{ ...inputStyle, flex: 1, margin: 0 }}
                  required
                />
                {questionType === "MATCHING" ? (
                  <input
                    type="text"
                    value={option.matchText}
                    onChange={(e) => handleMatchChange(index, e.target.value)}
                    placeholder={`Match for Option ${index + 1}`}
                    style={{ ...inputStyle, flex: 1, margin: 0, background: '#f0f4f8' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type={questionType === "MULTIPLE_CHOICE" || questionType === "POLL" ? "radio" : "checkbox"}
                      name="correctOption"
                      checked={option.correct}
                      onChange={() => handleCorrectChange(index)}
                      style={checkboxStyle}
                    />
                    <label style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', fontWeight: '500' }}>
                      {questionType === "POLL" ? "Selectable" : "Correct"}
                    </label>
                    <input type="file" accept="image/*" onChange={e => handleOptionMediaChange(index, 'image', e.target.files[0])} style={{ marginLeft: '1rem' }} />
                    <input type="file" accept="audio/*" onChange={e => handleOptionMediaChange(index, 'audio', e.target.files[0])} style={{ marginLeft: '0.5rem' }} />
                    <input type="file" accept="video/*" onChange={e => handleOptionMediaChange(index, 'video', e.target.files[0])} style={{ marginLeft: '0.5rem' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {questionType === "FILL_IN_THE_BLANK" && (
          <div>
            <label style={labelStyle}>Correct Answer</label>
            <input
              type="text"
              value={options[0].optionText}
              onChange={(e) => handleOptionChange(0, "optionText", e.target.value)}
              placeholder="Enter the correct answer"
              style={inputStyle}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...buttonStyle,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? "Adding Question..." : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;