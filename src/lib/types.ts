export type ChatRoomInfo = {
    id: string;
    url: string;
    title: string;
    transcript: string;
    description: string;
    summary: string;
    transcript_wts: Array<TranscriptWTS>;
};

export type TranscriptWTS = {
    text: string;
    start: number;
    duration: number;
};

export interface Message {
    id: string;
    vid_id: string;
    sent_by: string;
    content: string;
    created_at: Date;
    error?: string;
}

export type PromptSuggestion = {
    intent: string;
    content: string;
};
