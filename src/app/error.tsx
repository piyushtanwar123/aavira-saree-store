"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="not-found"><span className="eyebrow">A SMALL PAUSE IN THE STORY</span><h1>Something didn’t quite unfold.</h1><p>Please try again in a moment.</p><button className="button button-primary" onClick={reset}>Try again</button><Link className="text-link" href="/">Back to Aavira</Link></main>; }
