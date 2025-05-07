import { Button } from "./ui/button";
import { ArrowRight, BookOpen, Youtube, MessageSquare } from "lucide-react";

type HeroSectionType = {
    scrollToMain: () => void;
};

export const HeroSection = ({ scrollToMain }: HeroSectionType) => {
    return (
        <div className="bg-gradient-to-br from-red-50 to-slate-100 dark:from-slate-900 dark:to-red-950">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 space-y-6">
                        <div className="inline-block bg-red-100 dark:bg-red-900/30 px-4 py-1 rounded-full">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                                Your AI Learning Companion
                            </p>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white">
                            Learn Smarter with{" "}
                            <span className="text-red-600">YoutubeGPT</span>
                        </h1>
                        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-xl">
                            Your personal AI tutor that helps you understand and
                            discuss educational YouTube content. Ask questions,
                            get explanations, and deepen your knowledge.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                className="bg-red-600 hover:bg-red-700 text-white gap-2 cursor-pointer"
                                size="lg"
                                onClick={scrollToMain}
                            >
                                Get Started <ArrowRight className="h-4 w-4" />
                            </Button>
                            {/* <Button
                                variant="outline"
                                size="lg"
                                className="gap-2"
                            >
                                How It Works <BookOpen className="h-4 w-4" />
                            </Button> */}
                        </div>
                    </div>
                    <div className="flex-1 flex justify-center">
                        <div className="relative w-full max-w-md">
                            <div className="absolute -top-6 -left-6 bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg shadow-lg">
                                <Youtube className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-green-100 dark:bg-green-900/30 p-4 rounded-lg shadow-lg">
                                <MessageSquare className="h-8 w-8 text-slate-700 dark:text-slate-300" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-200 dark:border-slate-700">
                                <img
                                    src="/placeholder.svg?height=300&width=400"
                                    alt="YoutubeGPT Interface"
                                    className="rounded-lg w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full w-fit mb-4">
                            <Youtube className="h-6 w-6 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Educational Videos
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Access insights from any educational YouTube video
                            by simply sharing the URL.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full w-fit mb-4">
                            <MessageSquare className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Interactive Discussions
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Ask questions and have meaningful conversations
                            about the content you're learning.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mb-4">
                            <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">
                            Powered by RAG
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400">
                            Our Retrieval Augmented Generation system ensures
                            accurate and contextual responses.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
