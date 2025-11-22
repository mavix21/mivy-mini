'use client';

import { useState } from 'react';

export default function CreatePost() {
    // State for form inputs
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // For adding images to markdown

    // State for UI feedback
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const [resultCid, setResultCid] = useState('');

    // Helper to insert image markdown into the content area
    const handleAddImage = () => {
        if (!imageUrl) return;
        const imageMarkdown = `\n![Image Description](${imageUrl})\n`;
        setContent((prev) => prev + imageMarkdown);
        setImageUrl(''); // Clear input
    };

    // The main submit handler
    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });
        setResultCid('');

        try {
            // 1. Combine Title (optional) and Content if you want the file to strictly be the markdown
            // Or just send the raw content from the textarea. 
            // Let's add the title as an H1 at the top of the markdown file automatically.
            const finalMarkdown = `# ${title}\n\n${content}`;

            // 2. Send to our API
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    content: finalMarkdown,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload');
            }

            // 3. Handle Success
            setStatus({ type: 'success', message: 'Post published to Synapse!' });
            setResultCid(data.cid); // The IPFS CID returned by the API

            // Optional: Clear form
            // setTitle(''); setContent(''); 

        } catch (error: any) {
            setStatus({ type: 'error', message: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
                    <p className="mt-2 text-gray-600">Write in Markdown and publish directly to decentralized storage.</p>
                </div>

                <form onSubmit={handlePublish} className="space-y-6">

                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Post Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="My Awesome Story"
                        />
                    </div>

                    {/* Image Helper Section */}
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Insert Image via URL
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.png or ipfs://..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            />
                            <button
                                type="button"
                                onClick={handleAddImage}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition"
                            >
                                Add to Text
                            </button>
                        </div>
                    </div>

                    {/* Markdown Content Area */}
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content (Markdown)
                        </label>
                        <textarea
                            id="content"
                            required
                            rows={10}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                            placeholder="# Start writing here..."
                        />
                        <p className="mt-1 text-xs text-gray-500 text-right">
                            Supports standard Markdown syntax
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>

                {/* Feedback / Results */}
                {status.message && (
                    <div className={`mt-6 p-4 rounded-md ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        <div className="flex items-center">
                            {status.type === 'success' ? (
                                <span className="text-xl mr-2">✅</span>
                            ) : (
                                <span className="text-xl mr-2">⚠️</span>
                            )}
                            <p className="font-medium">{status.message}</p>
                        </div>

                        {/* If successful, show the CID link */}
                        {status.type === 'success' && resultCid && (
                            <div className="mt-4 pt-4 border-t border-green-200">
                                <p className="text-sm mb-1">Your content CID:</p>
                                <code className="block bg-green-100 p-2 rounded text-xs break-all">
                                    {resultCid}
                                </code>
                                <a
                                    href={`https://ipfs.io/ipfs/${resultCid}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-block mt-3 text-sm text-green-700 underline hover:text-green-900"
                                >
                                    View on IPFS Gateway &rarr;
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}