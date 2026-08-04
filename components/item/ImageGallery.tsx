"use client";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import type { CarouselRef } from "antd/es/carousel";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const carouselRef = useRef<CarouselRef>(null);
  const [active, setActive] = useState(0);
  const count = images.length;
  const showControls = count > 1;

  const goTo = useCallback((index: number) => {
    carouselRef.current?.goTo(index);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <div className="group relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-soft ring-1 ring-gray-200/50">
        <Carousel
          ref={carouselRef}
          fade
          dots={false}
          infinite
          speed={400}
          beforeChange={(_current, next) => setActive(next)}
        >
          {images.map((src, index) => (
            <div key={src} className="relative aspect-square">
              <Image
                src={src}
                alt={`${alt} image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>

        {showControls && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => carouselRef.current?.prev()}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-gray-700 opacity-80 shadow-lift backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
            >
              <LeftOutlined className="text-sm" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => carouselRef.current?.next()}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-gray-700 opacity-80 shadow-lift backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600"
            >
              <RightOutlined className="text-sm" />
            </button>
          </>
        )}

        {showControls && (
          <span className="absolute bottom-3 right-3 rounded-lg bg-green-900/70 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-white backdrop-blur-sm">
            {active + 1} / {count}
          </span>
        )}
      </div>

      {showControls && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Image thumbnails">
          {images.map((src, index) => {
            const isActive = index === active;
            return (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show image ${index + 1}`}
                onClick={() => goTo(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-600 ${
                  isActive
                    ? "opacity-100 ring-2 ring-green-600 ring-offset-2 ring-offset-paper"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={src}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
