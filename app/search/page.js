'use client'

import DisabilityChoice from "../components/disability-choice"
import { useSearchParams } from "next/navigation"

export default function SearchPage() {
    const searchParams = useSearchParams();
    const fromConfirm = searchParams.get('fromConfirm');

    return (
        <div>
            {fromConfirm && (
                <DisabilityChoice/>                
            )}
        </div>
    )
}