import React from "react";
import { Button } from "./ui/Buttons";

interface Props {
  url: string;
  title: string;
  description: string;
}

export function SocialShare({ url, title, description }: Props) {
  const shareData = {
    url,
    title,
    text: description,
  };

  const handleShare = async (platform: string) => {
    try {
      switch (platform) {
        case "native":
          if (navigator.share) {
            await navigator.share(shareData);
          }
          break;
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(
              title
            )}&url=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
        case "linkedin":
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            "_blank"
          );
          break;
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Share this cause</h3>
      <div className="flex flex-wrap gap-2">
        {typeof navigator.share === "function" && (
          <Button
            onClick={() => handleShare("native")}
            variant="outline"
            size="sm"
          >
            Share
          </Button>
        )}
        <Button
          onClick={() => handleShare("twitter")}
          variant="outline"
          size="sm"
        >
          Twitter
        </Button>
        <Button
          onClick={() => handleShare("facebook")}
          variant="outline"
          size="sm"
        >
          Facebook
        </Button>
        <Button
          onClick={() => handleShare("linkedin")}
          variant="outline"
          size="sm"
        >
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
