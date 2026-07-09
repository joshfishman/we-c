import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the GTM bridge so we can assert exactly what gets pushed to dataLayer.
const { sendGTMEvent } = vi.hoisted(() => ({ sendGTMEvent: vi.fn() }));
vi.mock("@next/third-parties/google", () => ({ sendGTMEvent }));

import {
  isEditing,
  track,
  trackCtaClick,
  trackLead,
  trackOutbound,
  trackSectionView,
  trackScrollDepth,
  trackFormSubmit,
} from "../../lib/track";

const goTo = (path: string) => window.history.replaceState({}, "", path);

beforeEach(() => {
  sendGTMEvent.mockClear();
  goTo("/");
});

describe("isEditing", () => {
  it("is false on a normal top-level page", () => {
    expect(isEditing()).toBe(false);
  });

  it("is true on the Tina /admin route", () => {
    goTo("/admin");
    expect(isEditing()).toBe(true);
  });
});

describe("track", () => {
  it("pushes a structured event to the dataLayer", () => {
    track("custom_event", { foo: "bar" });
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: "custom_event", foo: "bar" });
  });

  it("works with no params", () => {
    track("ping");
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: "ping" });
  });

  it("is suppressed inside the editor (/admin)", () => {
    goTo("/admin");
    track("custom_event");
    expect(sendGTMEvent).not.toHaveBeenCalled();
  });
});

describe("event helpers", () => {
  it("cta_click carries label + location", () => {
    trackCtaClick("Let's Grow", "header");
    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: "cta_click",
      label: "Let's Grow",
      location: "header",
    });
  });

  it("generate_lead is the primary conversion", () => {
    trackLead("Start a project", "our_work");
    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: "generate_lead",
      label: "Start a project",
      location: "our_work",
    });
  });

  it("outbound_click carries the url", () => {
    trackOutbound("https://instagram.com/we");
    expect(sendGTMEvent).toHaveBeenCalledWith({
      event: "outbound_click",
      url: "https://instagram.com/we",
    });
  });

  it("section_view carries the section", () => {
    trackSectionView("hero");
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: "section_view", section: "hero" });
  });

  it("scroll_depth carries the percent", () => {
    trackScrollDepth(75);
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: "scroll_depth", percent: 75 });
  });

  it("form_submit carries the form name", () => {
    trackFormSubmit("contact");
    expect(sendGTMEvent).toHaveBeenCalledWith({ event: "form_submit", form: "contact" });
  });

  it("every helper is suppressed in the editor", () => {
    goTo("/admin");
    trackCtaClick("x", "y");
    trackLead("x", "y");
    trackSectionView("z");
    expect(sendGTMEvent).not.toHaveBeenCalled();
  });
});
