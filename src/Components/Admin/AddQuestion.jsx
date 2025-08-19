import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/axiosInstance";
import { useLocation } from "react-router-dom";
import SuccessBox from "../User/SuccessBox";

const AddQuestions = () => {
  const location = useLocation();
  const { quizId, mode, questionData } = location.state || {};
  const fileInputRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState(0);
  const [points, setPoints] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Removed unused image state
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (mode === "edit" && questionData) {
      setQuestion(questionData.questionText);
      setOptions(questionData.options);
      setCorrectOption(questionData.correctOption);
      setPoints(questionData.points || 1);
      setImageUrl(questionData.imageUrl || "");
      
      // Reset image states when loading existing question
      setImagePreview(questionData.imageUrl || null);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [mode, questionData]);

  // Reset image states when imageUrl changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageUrl]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setImageLoading(true);
    setImageError(false);
    setImageLoaded(false);
    setError("");

    // Create local preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/images/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const uploadedImageUrl = response.data.data.imageUrl;
        setImageUrl(uploadedImageUrl);
        // Update preview to use the uploaded URL for consistency
        setImagePreview(uploadedImageUrl);
        setError("");
        
        console.log("Image uploaded successfully:", uploadedImageUrl);
      }
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error("Image upload error:", err);
      setImagePreview(null);
      setImageUrl("");
    } finally {
      setImageLoading(false);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
    console.log('Image loaded successfully:', imagePreview);
  };

  const handleImageError = (e) => {
    setImageError(true);
    setImageLoaded(false);
    console.error('Failed to load image:', e.target.src);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    setImageUrl("");
    setImageLoaded(false);
    setImageError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOrEditQuestion = async () => {
    if (!question || options.some((opt) => opt === "")) {
      setError("Please fill out all fields and options.");
      return;
    }

    const newQuestion = {
      questionText: question,
      options,
      correctOption,
      points,
      imageUrl, // This will be the Cloudinary URL or empty string
    };

    try {
      if (mode === "edit" && questionData?._id) {
        await api.put(
          `/admin/dashboard/quiz/${quizId}/question/${questionData._id}`,
          newQuestion
        );
      } else {
        await api.put("/admin/dashboard/quiz/questions", {
          _id: quizId,
          questions: [newQuestion],
        });

        // Reset form for new question
        setQuestion("");
        setOptions(["", "", "", ""]);
        setCorrectOption(0);
        setPoints(1);
        handleRemoveImage();
      }

      setSuccess(true);
      setError("");

      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error saving question:", error.response?.data || error);
      setError("Failed to save question. Please try again.");
    }
  };

  return (
    <div className="h-screen flex items-start justify-center bg-gray-100 pt-8">
      <div className="max-w-3xl w-full p-8 bg-white shadow-lg rounded-lg overflow-auto">
        <h1 className="text-2xl font-bold text-[#003E8A] mb-5">
          {mode === "edit" ? "Edit Question" : "Add Question"}
        </h1>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">
            {mode === "edit" ? "Update this question" : "Add New Question"}
          </h2>

          {error && <p className="text-red-500 bg-red-100 p-2 rounded-md">{error}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
              rows="3"
              placeholder="Enter your question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Question Image (Optional)</label>
            <div className="mt-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
              />
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="px-4 py-2 bg-[#003E8A]/10 text-[#003E8A] rounded-md cursor-pointer hover:bg-[#003E8A]/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {imageLoading ? "Uploading..." : imageUrl ? "Change Image" : "Upload Image"}
                </label>
                {imagePreview && (
                  <button
                    onClick={handleRemoveImage}
                    className="text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                    disabled={imageLoading}
                  >
                    Remove Image
                  </button>
                )}
              </div>

              {/* Image Preview with better error handling */}
              {imagePreview && (
                <div className="mt-4">
                  <div className="relative max-w-xs">
                    {/* Loading state */}
                    {!imageLoaded && !imageError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                        <div className="text-sm text-gray-500">Loading image...</div>
                      </div>
                    )}
                    
                    {/* Error state */}
                    {imageError && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
                        <div className="text-red-600 text-sm">Failed to load image</div>
                        <button 
                          onClick={handleRemoveImage}
                          className="text-red-500 text-xs mt-2 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    {/* Actual image */}
               <img
  src={imagePreview}
  alt="Question preview"
  onLoad={handleImageLoad}
  onError={handleImageError}
  className={`max-w-xs rounded-md shadow-sm transition-opacity ${
    imageError ? 'hidden' : 'block'
  } ${imageLoaded ? 'opacity-100' : 'opacity-50'}`}
/>

                  </div>
                </div>
              )}

              <p className="mt-2 text-sm text-gray-500">
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Options</label>
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="correctOption"
                  className="accent-[#003E8A]"
                  checked={correctOption === idx}
                  onChange={() => setCorrectOption(idx)}
                />
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
                  placeholder={`Option ${idx + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Points</label>
            <input
              type="number"
              className="w-24 border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#003E8A]"
              value={points}
              onChange={(e) => setPoints(Number(e.target.value))}
              min="1"
            />
          </div>

          <button
            className="w-full bg-[#003E8A] hover:bg-[#003E8A]/90 text-white font-semibold py-3 rounded-md transition cursor-pointer disabled:opacity-50"
            onClick={handleAddOrEditQuestion}
            disabled={imageLoading}
          >
            {mode === "edit" ? "Update Question" : "+ Add Question"}
          </button>
        </div>
      </div>

      {success && (
        <SuccessBox
          message={
            mode === "edit"
              ? "Question updated successfully!"
              : "Question added successfully!"
          }
        />
      )}
    </div>
  );
};

export default AddQuestions;