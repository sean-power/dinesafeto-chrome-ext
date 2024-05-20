// Define paths for enabled and disabled icons
const enabledIconPath = {
    "16": "/images/dinesafe16.png",
    "32": "/images/dinesafe32.png",
    "48": "/images/dinesafe48.png",
    "128": "/images/dinesafe128.png"
};

const disabledIconPath = {
    "16": "/images/dinesafe16_disabled.png",
    "32": "/images/dinesafe32_disabled.png",
    "48": "/images/dinesafe48_disabled.png",
    "128": "/images/dinesafe128_disabled.png"
};

// Function to update the extension icon
function updateIcon(enabled) {
    const path = enabled ? enabledIconPath : disabledIconPath;
    chrome.action.setIcon({ path });
}

// Function to toggle the extension state
function toggleExtensionState() {
    chrome.storage.sync.get('enabled', function(data) {
        const enabled = !(data.enabled || false);
        chrome.storage.sync.set({ enabled }, function() {
            updateIcon(enabled);
        });
    });
}

// Add event listener for extension installation and uninstallation
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "uninstall") {
        // Reset extension state to disabled upon uninstallation
        chrome.storage.sync.set({ enabled: false }, function() {
            console.log("Extension state reset to disabled upon uninstallation.");
            // Update icon after resetting state
            updateIcon(false);
        });
    }
});

// Initialize extension state and icon
chrome.storage.sync.get('enabled', function(data) {
    const enabled = data.enabled || false;
    updateIcon(enabled);
});

// Add click event listener to toggle extension state
chrome.action.onClicked.addListener(toggleExtensionState);

// Add message listener to handle messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "requestPermission") {
      // Check permission and send response
      chrome.permissions.contains({ host_permissions: ["https://*.googleapis.com/*"] }, (granted) => {
        sendResponse({ granted });
      });
    } else if (request.action === "fetchDineSafeData") {
      // Fetch data from the JSON host and send response
      fetchDataFromServer(request.establishmentData)
        .then((data) => {
          sendResponse({ data });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          sendResponse({ error });
        });
    }
  });