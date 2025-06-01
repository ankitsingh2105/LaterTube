const addSaveButtonToTitle = () => {
    const titleContainer = document.querySelector("#title.ytd-watch-metadata h1");

    if (titleContainer && !titleContainer.querySelector(".save-btn")) {
        const saveBtn = document.createElement("button");
        saveBtn.innerText = "Watch Later";
        saveBtn.classList.add("save-btn");
        const isDarkMode = document.documentElement.getAttribute("dark") !== null;

        saveBtn.style.cssText = `
            margin-left: 10px; 
            cursor: pointer; 
            font-weight: bolder; 
            border-radius: 18px; 
            border: none; 
            padding: 5px 15px; 
            font-family: 'Roboto', Arial, sans-serif;
            background: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#f2f2f2"};
            color: ${isDarkMode ? "white" : "black"};
            transition: background 0.3s ease;
        `;

        saveBtn.addEventListener("mouseover", () => {
            saveBtn.style.background = isDarkMode ? "#3E3E3E" : "#d9d9d9";
        });

        saveBtn.addEventListener("mouseout", () => {
            saveBtn.style.background = isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#f2f2f2";
        });


        titleContainer.appendChild(saveBtn);

        saveBtn.addEventListener("click", () => {
            const title = titleContainer.innerText.trim();
            const url = window.location.href;

            const videoID = new URL(url).searchParams.get("v");
            const thumbnail = videoID
                ? `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`
                : "";


            try {
                chrome?.storage?.local?.get(["savedVideos"], (data) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error accessing storage:", chrome.runtime.lastError);
                        return;
                    }

                    const savedVideos = data.savedVideos || [];

                    const isAlreadySaved = savedVideos.some((video) => video.url === url);
                    if (isAlreadySaved) {
                        alert("LaterTube : Video already added to the watch list ⚡");
                        return;
                    }
                    savedVideos.push({id : videoID, title, url, thumbnail, tag: "", links : [] });
                    chrome?.storage?.local?.set({ savedVideos }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error saving video:", chrome.runtime.lastError);
                        } else {
                            alert("LaterTube : Video added to watch list");
                            console.log("Video saved successfully.");
                        }
                    });
                });
            } catch (error) {
                console.error("Error in Save button logic:", error);
            }
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSaveButtonToTitle);
} else {
    addSaveButtonToTitle();
}

const observer = new MutationObserver(() => {
    addSaveButtonToTitle();
});

observer.observe(document.body, { childList: true, subtree: true });
