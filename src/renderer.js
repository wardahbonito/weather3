const fs = require('fs');
const path = require('path');

// Define file path for CRUD operations and ensure 'Files' directory exists
const pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName, { recursive: true });
}

// Function to fetch weather data based on user input
async function fetchWeather(location) {
    const apiKey = '32804b24a847407391c53709241010'; // Replace with your WeatherAPI key
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            alert("Could not fetch weather data. Please check the country or city name and try again.");
            return;
        }

        // Display key weather information
        document.getElementById('location').textContent = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
        document.getElementById('local-time').textContent = `Local Time: ${data.location.localtime}`;
        document.getElementById('current-temperature').textContent = `Current Temperature: ${data.current.temp_c} °C`;
        document.getElementById('wind-speed').textContent = `Wind Speed: ${data.current.wind_kph} kph`;
        document.getElementById('humidity').textContent = `Humidity: ${data.current.humidity}%`;
        document.getElementById('weather-condition').textContent = `Weather Condition: ${data.current.condition.text}`;
        document.getElementById('chance-of-snow').textContent = `Chance of Snow: ${data.current.snow ? data.current.snow : 0} cm`;
        document.getElementById('chance-of-rain').textContent = `Chance of Rain: ${data.current.precip_mm} mm`;

        // Display recommendations based on weather
        displayRecommendations(data);

        // Call createFile to save the fetched weather data as a text file
        createFile(data.location.name, data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        alert("Could not fetch weather data. Please check your internet connection and try again.");
    }
}

// Function to display recommendations based on weather conditions
function displayRecommendations(data) {
    const condition = data.current.condition.text.toLowerCase();
    let recommendations = "";

    if (condition.includes("rain")) {
        recommendations = `
            <ul>
                <li>Read a book</li>
                <li>Watch a movie</li>
                <li>Try some indoor cooking or baking</li>
            </ul>`;
    } else if (condition.includes("snow")) {
        recommendations = `
            <ul>
                <li>Go skiing</li>
                <li>Build a snowman</li>
                <li>Enjoy hot chocolate by the fireplace</li>
            </ul>`;
    } else if (condition.includes("clear")) {
        recommendations = `
            <ul>
                <li>Go hiking</li>
                <li>Take a bike ride</li>
                <li>Go paragliding</li>
                <li>Visit a park</li>
            </ul>`;
    } else if (condition.includes("cloudy")) {
        recommendations = `
            <ul>
                <li>Take a leisurely walk</li>
                <li>Have a picnic</li>
                <li>Visit a museum</li>
            </ul>`;
    } else if (condition.includes("storm")) {
        recommendations = `
            <ul>
                <li>Stay indoors</li>
                <li>Do some indoor crafts</li>
                <li>Organize your space</li>
            </ul>`;
    } else {
        recommendations = `
            <ul>
                <li>Explore new places</li>
                <li>Try out a new hobby</li>
                <li>Visit friends or family</li>
            </ul>`;
    }

    document.getElementById('recommendations').innerHTML = recommendations;
}

// Get location from user input and call fetchWeather
function getWeather() {
    const location = document.getElementById('countryInput').value;
    if (location) {
        fetchWeather(location);
    } else {
        alert("Please enter a country or city name.");
    }
}

let currentFileName = ''; // Track the original file name when updating

// Load and display the list of created files
function loadFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = ""; // Clear the existing list

    fs.readdir(pathName, (err, files) => {
        if (err) {
            console.error("Failed to read files directory.", err);
            return;
        }

        files.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            fileList.appendChild(option);
        });
    });
}

// Function to create a file with weather details
function createFile(location, weatherData) {
    const fileName = `${location}.txt`; // Create a text file with the location name
    const filePath = path.join(pathName, fileName);

    const contents = `Weather Details for ${location}:\n` +
                     `Local Time: ${weatherData.location.localtime}\n` +
                     `Current Temperature: ${weatherData.current.temp_c} °C\n` +
                     `Wind Speed: ${weatherData.current.wind_kph} kph\n` +
                     `Humidity: ${weatherData.current.humidity}%\n` +
                     `Weather Condition: ${weatherData.current.condition.text}\n` +
                     `Chance of Snow: ${weatherData.current.snow ? weatherData.current.snow : 0} cm\n` +
                     `Chance of Rain: ${weatherData.current.precip_mm} mm\n`;

    fs.writeFile(filePath, contents, (err) => {
        if (err) {
            alert("Failed to create the file.");
            return;
        }
        alert(`File created successfully: ${fileName}`);
        loadFileList(); // Refresh the file list after creating a file
    });
}

// CRUD Functions for Files
function readFile() {
    const fileName = document.getElementById('fileList').value; // Use selected file name
    if (!fileName) {
        alert("Please select a file to read.");
        return;
    }

    const filePath = path.join(pathName, fileName);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            alert("Failed to read the file. Make sure the file exists.");
            return;
        }

        document.getElementById('fileContent').textContent = data;
        document.getElementById('fileContentSection').style.display = "block";
    });
}

function updateFile() {
    const fileName = document.getElementById('fileList').value; // Use selected file name
    const contents = document.getElementById('updateContent').value; // Update contents should be from update textarea

    if (!fileName) {
        alert("Please select a file to update.");
        return;
    }

    const filePath = path.join(pathName, fileName);

    fs.writeFile(filePath, contents, (err) => {
        if (err) return alert("Failed to update the file.");
        alert("File updated successfully!");
        loadFileList(); // Refresh the file list after updating a file
    });
}

function showUpdateForm() {
    const fileName = document.getElementById('fileList').value; // Use selected file name

    if (!fileName) {
        alert("Please select a file to update.");
        return;
    }

    const filePath = path.join(pathName, fileName);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            alert("Failed to read the file for updating. Make sure the file exists.");
            return;
        }

        currentFileName = fileName; // Store the original file name
        document.getElementById('updateFileName').value = fileName; // Set the original file name
        document.getElementById('updateContent').value = data; // Populate textarea with file data
        document.getElementById('updateForm').style.display = "block"; // Show update form
        document.getElementById('updateFileName').focus(); // Set focus to the file name input
    });
}

function submitUpdate() {
    const newFileName = document.getElementById('updateFileName').value.trim();
    const newContent = document.getElementById('updateContent').value;

    if (!newFileName || !newContent) {
        alert("Please enter both a file name and content.");
        return;
    }

    const oldFilePath = path.join(pathName, currentFileName);
    const newFilePath = path.join(pathName, newFileName);

    fs.writeFile(newFilePath, newContent, (err) => {
        if (err) {
            alert("Failed to update the file.");
            return;
        }

        if (newFilePath !== oldFilePath) {
            fs.unlink(oldFilePath, (err) => {
                if (err) {
                    alert("Failed to delete the old file.");
                    return;
                }
            });
        }

        alert("File updated successfully!");
        loadFileList(); // Refresh the file list after updating
        document.getElementById('updateForm').style.display = "none"; // Hide update form
    });
}

function deleteFile() {
    const fileName = document.getElementById('fileList').value; // Use selected file name
    if (!fileName) {
        alert("Please select a file to delete.");
        return;
    }

    const filePath = path.join(pathName, fileName);
    fs.unlink(filePath, (err) => {
        if (err) {
            alert("Failed to delete the file.");
            return;
        }
        alert("File deleted successfully!");
        loadFileList(); // Refresh the file list after deletion
    });
}

// Initial load of file list on page load
window.onload = loadFileList;
