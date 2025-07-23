export type Todo = {
    id: number;
    title: string;
    completed: boolean;
}

export type Memo = {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high';
}