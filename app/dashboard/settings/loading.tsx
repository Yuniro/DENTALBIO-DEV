import React from "react";

// Glowing Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="membar-cards animate-pulse">
      <div className="d-flex align-items-center gap-3">
        <div className="flex flex-col gap-0 bg-neutral-100 rounded-md w-10 h-16"></div>
        <div className="w-100">
          <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
            <div className="bg-neutral-100 w-3/5 h-6 rounded-md mb-2"></div>
            <div className="bg-neutral-100 w-1/5 h-6 rounded-md"></div>
          </div>
          <div className="bg-neutral-100 w-full h-5 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default function Loading() {
  return (
    <div className="memberpanel-details-wrapper">
      <div id="columns">
        <div className="animate-pulse rounded-full bg-white mb-10 w-32 h-32 aspect-square mx-auto flex items-center justify-center">
          <div className="rounded-full bg-neutral-100 w-28 h-28 aspect-square"></div>
        </div>
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    </div>
  );
}
