import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Contact() {
  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted!"); // Debug log
    setLoading(true);
    try {
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData);
      console.log("Form data:", data); // Debug log
      // Example fetch to backend (update endpoint as needed)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log("API response:", result); // Debug log
      if (result.success) {
        alert(result.message || "Form submitted successfully!");
        event.target.reset();
      } else {
        alert(result.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Error in onSubmit:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
      <Toaster position="top-center" />
      <form onSubmit={onSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
          <input type="text" name="name" id="name" required className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
          <input type="email" name="email" id="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Message</label>
          <textarea name="message" id="message" required rows="4" className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"></textarea>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300">
          {loading ? "Sending..." : "Submit Form"}
        </button>
      </form>
    </div>
  );
} 