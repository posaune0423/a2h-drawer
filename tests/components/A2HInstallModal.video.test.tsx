import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import { A2HInstallModal } from "../../src/components/A2HInstallModal.tsx";

describe("A2HInstallModal Video Playback (Requirement 9.8)", () => {
  const mockPlay = mock(async () => Promise.resolve());
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const originalPlay = HTMLMediaElement.prototype.play;

  beforeEach(() => {
    // Mock play method
    HTMLMediaElement.prototype.play = mockPlay;
  });

  afterEach(() => {
    // Restore original play method
    HTMLMediaElement.prototype.play = originalPlay;
    mockPlay.mockClear();
  });

  test("attempts to play video when modal opens with video media", async () => {
    const { rerender, getByTestId } = render(
      <A2HInstallModal
        open={false}
        onOpenChange={() => {}}
        media={{
          kind: "video",
          src: "/instruction.mp4",
        }}
      />,
    );

    // Initially closed, no play attempt
    expect(mockPlay).not.toHaveBeenCalled();

    // Open the modal
    rerender(
      <A2HInstallModal
        open={true}
        onOpenChange={() => {}}
        media={{
          kind: "video",
          src: "/instruction.mp4",
        }}
      />,
    );

    // Wait for the play attempt
    await waitFor(() => {
      expect(mockPlay).toHaveBeenCalled();
    });

    // Video element should exist
    const video = getByTestId("instruction-video");
    expect(video).toBeDefined();
    expect(video.getAttribute("src")).toBe("/instruction.mp4");
  });

  test("handles autoplay rejection gracefully", async () => {
    // Mock play to reject (simulating autoplay block)
    const rejectingPlay = mock(async () => Promise.reject(new Error("Autoplay blocked")));
    HTMLMediaElement.prototype.play = rejectingPlay;

    // This should not throw even when autoplay is blocked
    const { getByTestId } = render(
      <A2HInstallModal
        open={true}
        onOpenChange={() => {}}
        media={{
          kind: "video",
          src: "/instruction.mp4",
        }}
      />,
    );

    // Wait for the play attempt
    await waitFor(() => {
      expect(rejectingPlay).toHaveBeenCalled();
    });

    // Video should still be rendered
    const video = getByTestId("instruction-video");
    expect(video).toBeDefined();
  });

  test("video has correct attributes for iOS playback", () => {
    const { getByTestId } = render(
      <A2HInstallModal
        open={true}
        onOpenChange={() => {}}
        media={{
          kind: "video",
          src: "/instruction.mp4",
        }}
      />,
    );

    const video = getByTestId("instruction-video");

    // Check for iOS-friendly video attributes
    expect(video.hasAttribute("playsinline")).toBe(true);
    expect(video.hasAttribute("muted")).toBe(true);
  });
});
