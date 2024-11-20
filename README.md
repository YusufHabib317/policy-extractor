
# Policy Extractor & Analyzer

  

## Overview

  

The **Policy Extractor & Analyzer** is a browser-based tool designed to:

1. Extract **Privacy Policies** or **Terms of Service** from web pages.

2. Analyze the extracted content using AI (via GPT) to provide:

- A summary

- Key points

- User implications

- Potential concerns

- A user-friendliness score

  

This tool helps users better understand the often lengthy and complex documents they encounter on websites.

  

---

  

## Features

  

-  **Text Extraction:** Automatically detects and extracts Privacy Policies or Terms of Service from active browser tabs.

-  **AI Analysis:** Sends the extracted text to a GPT server for detailed analysis and insights.

-  **Download Options:** Download the extracted content or the analysis as a text or markdown file.

-  **Copy to Clipboard:** Easily copy the AI-generated analysis for quick sharing or reference.

  

---

  

## GPT Server

  

The AI analysis is powered by a GPT server. Ensure the server is running and accessible at:

  

**Server URL:** [https://privacy-summary-gpt.vercel.app/api/gpt](https://privacy-summary-gpt.vercel.app/api/gpt)

  

---

  

## How to Build

  

This project is built using [Vite](https://vitejs.dev/) 
  

### Steps to Build

  

1. Clone this repository:

```bash

git clone https://github.com/YusufHabib317/policy-extractor.git

cd policy-extractor

Basic Setup

1. Install dependencies:

yarn


2. Build the project:

npm  run  build

yarn  build

```

3. The built files will be generated in the `dist/` folder.

### How to Load the Extension in Google Chrome

After building the project, you can load it as a Chrome extension:

1. Open Chrome and navigate to:

```

chrome://extensions/

```

2. Enable **Developer Mode** (toggle in the top right corner).

3. Click **Load unpacked**.

4. Select the `dist/` folder generated during the build process.

5. The extension will now be available in your Chrome browser.

Usage

1. Navigate to a webpage with a Privacy Policy or Terms of Service.

2. Click on the extension icon in Chrome.

3. Click **Detect & Extract** to identify and extract the document.

4. Use the **Analyze with AI** button to send the text to the GPT server for analysis.

5. Copy or download the analysis for further use.