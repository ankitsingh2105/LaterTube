const addSaveButtonToTitle = () => {
    const titleContainer = document.querySelector("#title.ytd-watch-metadata h1");

    if (titleContainer && !titleContainer.querySelector(".save-btn")) {
        const saveBtn = document.createElement("button");
        saveBtn.innerText = "Watch Later";
        saveBtn.classList.add("save-btn");
        saveBtn.style.cssText = `
            margin-left: 10px; 
            cursor: pointer; 
            font-weight: bolder; 
            border-radius: 18px; 
            background: rgba(255, 255, 255, 0.1); 
            border: none; 
            padding: 5px 15px; 
            color: white;
            font-family: 'Roboto', Arial, sans-serif;
        `;
        saveBtn.addEventListener('mouseover', () => {
            saveBtn.style.background = '#3E3E3E';
        });
        
        saveBtn.addEventListener('mouseout', () => {
            saveBtn.style.background = 'rgba(255, 255, 255, 0.1)';
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
                chrome.storage.local.get(["savedVideos"], (data) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error accessing storage:", chrome.runtime.lastError);
                        return;
                    }

                    const savedVideos = data.savedVideos || [];

                    const isAlreadySaved = savedVideos.some((video) => video.url === url);
                    if (isAlreadySaved) {
                        alert("This video is already added to the watch list ⚡.");
                        return;
                    }
                    savedVideos.push({ title, url, thumbnail, tag: "", time_added: "" });
                    chrome.storage.local.set({ savedVideos }, () => {
                        if (chrome.runtime.lastError) {
                            console.error("Error saving video:", chrome.runtime.lastError);
                        } else {
                            alert("Video saved!");
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

