import React from "react";
import { Skeleton } from "./Skeleton";


 //  STATS SKELETON


export const StatsSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg p-4 space-y-3 animate-pulse">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-6 w-16" />
    </div>
  );
};


  // COURSE CARD SKELETON
export const CourseSkeleton = () => {
  return (
    <div className="bg-white border rounded-lg overflow-hidden animate-pulse">

      <Skeleton className="h-36 w-full" />

      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-9 w-full mt-3" />
      </div>

    </div>
  );
};


   //FULL DASHBOARD SKELETON

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-6">

      <div className="grid md:grid-cols-3 gap-4">
        <StatsSkeleton />
        <StatsSkeleton />
        <StatsSkeleton />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <CourseSkeleton />
        <CourseSkeleton />
        <CourseSkeleton />
      </div>

    </div>
  );
};