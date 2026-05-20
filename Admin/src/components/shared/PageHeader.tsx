"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface Props {
  title: string;
  description?: string;
  backHref?: string;
}

export default function PageHeader({ title, description, backHref }: Props) {
  return (
    <div className="mb-6">
      {backHref && (
        <Link href={backHref} className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors mb-3">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>
      )}
      <h1 className="page-title">{title}</h1>
      {description && <p className="text-text-muted text-sm mt-1">{description}</p>}
    </div>
  );
}
