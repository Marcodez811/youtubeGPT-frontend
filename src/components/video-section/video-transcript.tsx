export default function VideoTranscript() {
    return (
        <>
            <h2 className="text-xl font-bold mb-4">Video Transcript</h2>
            <div className="space-y-4">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {i}:{i < 10 ? "0" : ""}
                            {i * 10}
                        </p>
                        <p className="text-sm">
                            {i === 0
                                ? "Hello everyone! Welcome to this tutorial on React Hooks."
                                : `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
}
