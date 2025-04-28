import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaBitcoin, FaDollarSign, FaQuoteLeft, FaExchangeAlt } from "react-icons/fa";
import Footer from "./layout/Footer";
import NavDash from "./layout/NavDash";

function Start() {
  const [sessionData, setSessionData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [quote, setQuote] = useState("");
  const [currencyRate, setCurrencyRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch mining session data
  const fetchStartMining = async () => {
    try {
      const Token = localStorage.getItem("Token");
  
      if (!Token) {
        alert("You need to log in first.");
        window.location.href = '/login';
        return;
      }
  
      const gameCompleted = localStorage.getItem("gameCompleted");
      console.log("gameCompleted value:", gameCompleted);  

      if (!gameCompleted || gameCompleted !== "true") {
        window.location.href = "/game";
        return;
      }
      
      const apiUrl = import.meta.env.VITE_API_URL;
      console.log("API URL:", apiUrl);
  
      const response = await axios.post(
        `${apiUrl}/api/mining/start`,
        {},
        {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        }
      );
  
      if (response?.data?.session) {
        setSessionData(response.data.session);
        // Reset game completion status only after successful API call
        localStorage.removeItem("gameCompleted");
      } else {
        setErrorMessage("Failed to fetch mining session data.");
      }
    } catch (error) {
      console.error("Error starting mining session:", error);
      setErrorMessage("An error occurred while starting mining.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMotivationalQuote = async () => {
    try {
      const response = await axios.get("https://zenquotes.io/api/random");
      if (response?.data?.length) {
        setQuote(`${response.data[0].q} — ${response.data[0].a}`);
      }
    } catch (error) {
      console.error("Error fetching motivational quote:", error);
      setQuote("Stay motivated and keep pushing forward!");
    }
  };

  const fetchCurrencyRate = async () => {
    try {
      const response = await axios.get(
        "https://api.exchangerate.host/latest?base=USD&symbols=EUR,GBP"
      );
      if (response?.data?.rates) {
        setCurrencyRate({
          USDToEUR: response.data.rates.EUR?.toFixed(2) || "N/A",
          USDToGBP: response.data.rates.GBP?.toFixed(2) || "N/A",
        });
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
      setCurrencyRate({
        USDToEUR: "N/A",
        USDToGBP: "N/A",
      });
    }
  };

  useEffect(() => {
    fetchStartMining();
    fetchMotivationalQuote();
    fetchCurrencyRate();
  }, []);

  const handlePlayAgain = () => {
    window.location.href = '/game';
  };

  return (
    <>
      <NavDash />

      <motion.div
        className="bg-black text-yellow-300 p-6 shadow-lg items-center min-h-screen border-golden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl font-bold mb-6 text-center text-yellow-400"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Mining Dashboard
        </motion.h1>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            className="bg-red-600 p-2 rounded mb-4 text-yellow-100 text-center"
            initial={{ x: "-100vw" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Mining Session Info */}
        <div className="flex flex-col items-center gap-6 mb-6">
          {isLoading ? (
            <motion.div className="bg-black border border-yellow-400 p-4 rounded-lg shadow-lg text-center">
              <div className="flex justify-center items-center gap-2">
                <FaBitcoin className="text-yellow-400 text-2xl" />
                <p>Loading session data...</p>
              </div>
            </motion.div>
          ) : sessionData ? (
            <motion.div
              className="bg-black border border-yellow-400 p-4 rounded-lg shadow-lg text-yellow-400 hover:scale-105 transition-all"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <FaUser className="text-yellow-400 text-2xl" />
                <h2 className="text-2xl font-semibold">Session Info</h2>
              </div>
              <p><strong>User ID:</strong> {sessionData.userId}</p>
              <p><strong>Username:</strong> {sessionData.username}</p>
              <p><strong>Is Mining:</strong> {sessionData.isMining ? "Yes" : "No"}</p>
              <p><strong>Coins Mined:</strong> {sessionData.coinsMined}</p>
              <p><strong>Elapsed Time:</strong> {Math.floor(sessionData.elapsedTime)} seconds</p>
              <p><strong>Elapsed Time in Hours:</strong> {(sessionData.elapsedTime / 3600).toFixed(2)} hours</p>

              <button
                onClick={handlePlayAgain}
                className="mt-6 px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
              >
                Play Game Again
              </button>
            </motion.div>
          ) : null}
        </div>

        {/* Motivational Quote Card */}
        <motion.div
          className="bg-black border-yellow-300 border p-4 rounded-lg shadow-lg text-yellow-400 text-center mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaQuoteLeft className="text-yellow-400 text-lg" />
            <h2 className="text-lg font-semibold">Daily Motivation</h2>
          </div>
          <p className="italic text-gray-300">"{quote}"</p>
        </motion.div>

        {/* Currency Rates Card */}
        <motion.div
          className="bg-black border-yellow-300 border p-4 rounded-lg shadow-lg text-yellow-400 text-center mb-6"
          whileHover={{ scale: 1.05 }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <FaExchangeAlt className="text-yellow-400 text-lg" />
            <h2 className="text-lg font-semibold">Currency Exchange Rates</h2>
          </div>
          {currencyRate ? (
            <>
              <p><strong>USD to EUR:</strong> €{currencyRate.USDToEUR}</p>
              <p><strong>USD to GBP:</strong> £{currencyRate.USDToGBP}</p>
            </>
          ) : (
            <p>Loading rates...</p>
          )}
        </motion.div>

        <Footer />
      </motion.div>
    </>
  );
}

export default Start;
