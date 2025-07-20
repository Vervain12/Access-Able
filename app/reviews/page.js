"use client"

import Header from "../components/header";
import { UserReviewList } from "../components/review-list";

// Related bool is unused
export default function Reviews() {
    return (
        <div>
            <UserReviewList relatedBool={false}/>
        </div>
    )
}