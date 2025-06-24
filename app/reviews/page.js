"use client"

import Header from "../components/header";
import { UserReviewList } from "../components/review-list";

export default function Reviews() {
    return (
        <div>
            <UserReviewList relatedBool={false}/>
            <UserReviewList relatedBool={true}/>
        </div>
    )
}