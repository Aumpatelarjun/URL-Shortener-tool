import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './home.css'; 

const Home = () => {
    const [originalUrl, setOriginalUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isValid, setIsValid] = useState(true);


    useEffect(() => {
        const fullPath = window.location.href;
        const shortUrl = fullPath.replace(`http://localhost:3000/${fullPath}`); 
        console.log(shortUrl)
        const originalUrl = Object.keys(localStorage).find(key => localStorage.getItem(key) === shortUrl);
        console.log(originalUrl)
    
        if (originalUrl) {
            window.location.href = originalUrl;
        }
    }, []);
    

    const isURLValid = async (url) => {
        try {
            console.log("here in")
            const response = await axios.head(`https://cors-anywhere.herokuapp.com/${url}`);
            console.log(response)
            return response.status >= 200 && response.status < 400;
        } catch (error) {
            console.log(error)
            return false;
        }
    };

    function generateBase62String() {
        const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const randomValues = new Uint8Array(7);
        window.crypto.getRandomValues(randomValues);
        let result = "";
    
        for (let i = 0; i < 7; i++) {
            const index = randomValues[i] % 62;
            result += charset.charAt(index);
        }
    
        return result;
    }       

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = originalUrl.trim();
        const valid = await isURLValid(url);
        setIsValid(valid);

        if(valid){
            if(localStorage.getItem(url) !== null) {
                setShortUrl(localStorage.getItem(url))
            }

            else{
                const newShortUrl = generateBase62String();
                setShortUrl(`http://localhost:3000/${newShortUrl}`);
                localStorage.setItem(url, `http://localhost:3000/${newShortUrl}`);
            }
            console.log(shortUrl);
           
        }
        else{
            console.log("your url is not good , bad url")
        }
    };

    return (
        <>
        <div className="container">
            <h1>URL Shortener Tool</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="originalUrl">Original URL:</label>
                    <input
                        type="text"
                        id="originalUrl"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="shortUrl">Generated Short URL:</label>
                    <input
                        type="text"
                        id="shortUrl"
                        value={shortUrl}
                        readOnly
                    />
                </div>
                <button type="submit">Generate Short URL</button>
            </form>
        </div>
        </>
    );
};

export default Home;
