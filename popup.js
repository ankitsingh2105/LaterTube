const videoList = document.getElementById('video-list');
const clearButton = document.getElementById('clear-all');

const renderSavedVideos = (savedVideos) => {

    savedVideos.forEach((video, index) => {
        console.log("video ", index, " :: ", video);
        const listItem = document.createElement('li');
        const videoLink = document.createElement('a');
        const thumbnail = document.createElement('img');

        const card = document.createElement("main");
        const div1 = document.createElement("div");
        const div2 = document.createElement("b");

        videoLink.href = video.url;
        videoLink.target = '_blank';
        // const videoTitle = video.title.
        videoLink.textContent = video.title;

        thumbnail.src = video.thumbnail;

        div1.appendChild(thumbnail);
        div2.appendChild(videoLink);

        card.appendChild(div1);
        card.appendChild(div2);

        listItem.appendChild(card);

        videoList.appendChild(listItem);

    });
};

// todo ::  fetch saved videos from storage
chrome.storage.local.get(['savedVideos'], (data) => {
    if (chrome.runtime.lastError) {
        console.error('Error accessing storage:', chrome.runtime.lastError);
        return;
    }

    const savedVideos = data.savedVideos || [];

    // Render saved videos
    renderSavedVideos(savedVideos);

    // Handle Clear All button click
    clearButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all saved videos?')) {
            // Clear the saved videos from Chrome storage
            chrome.storage.local.set({ savedVideos: [] }, () => {
                if (chrome.runtime.lastError) {
                    console.error('Error clearing saved videos:', chrome.runtime.lastError);
                } else {
                    // Refresh the list
                    videoList.innerHTML = '';
                    renderSavedVideos([]);
                    alert('All saved videos have been cleared.');
                }
            });
        }
    });
});
