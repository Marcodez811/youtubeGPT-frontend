import { Youtube, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center gap-8">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Youtube className="h-5 w-5 text-red-500" />
                            YouTubeGPT
                        </h3>
                        <p className="text-slate-400">
                            Your AI learning companion for educational YouTube
                            content. Ask questions, get explanations, and deepen
                            your knowledge.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col gap-4 justify-center items-center">
                    <p className="text-slate-400 text-sm">
                        © {new Date().getFullYear()} YouTubeGPT. All rights
                        reserved.
                    </p>
                    <div className="mt-4 md:mt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-slate-400 border-slate-700 hover:bg-slate-800"
                        >
                            Contact Us
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
