import Link from 'next/link';
import React from 'react';

interface ToastMessageProps {
    count: number;
    isSuccess: boolean;
    showLink?: boolean;
}

export const ToastMessage: React.FC<ToastMessageProps> = ({ count, isSuccess, showLink = true }) => {
    const message = isSuccess
        ? `Finished processing ${count} pending item(s).`
        : `Failed to process ${count} pending item(s).`;

    if (!showLink) return <div>{message}</div>;

    return (
        <div className="flex flex-col">
            {message}
            <Link
                href="/user/pending"
                className="font-medium text-primary hover:underline"
            >
                View
            </Link>
        </div>
    );
};