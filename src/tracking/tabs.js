export const TRACKING_TABS = {
  DETAIL: "detail",
  LOG: "log",
};

export function createTrackingTabs(refs) {
  const setTab = (tab) => {
    refs.tabs.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.trackingTab === tab);
    });

    refs.panels.forEach((panel) => {
      panel.hidden = panel.dataset.trackingPanel !== tab;
    });
  };

  return {
    setDetailTab: () => setTab(TRACKING_TABS.DETAIL),
    setLogTab: () => setTab(TRACKING_TABS.LOG),
    setTab,
  };
}
