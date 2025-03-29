import React, { useState, type FC, type ChangeEvent } from "react";
import {
    createComment,
    deleteComment,
    editComment,
} from "@/services/comments/commentsService";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { Task } from "../../utils/types/types";

interface TaskCommentsProps {
    task: Task;
    setTask: (task: Task) => void;
}

const TaskComments: FC<TaskCommentsProps> = ({ task, setTask }) => {
    const { data: session } = useSession();
    const [comment, setComment] = useState<string>("");
    const [modalDelete, setModalDelete] = useState<{ idComment: string; modalOpen: boolean }>({
        idComment: "",
        modalOpen: false,
    });
    const [editingCommentId, setEditingCommentId] = useState<string | null>(
        null
    ); // Estado para el comentario en edición
    const [editingCommentText, setEditingCommentText] = useState<string>(""); // Estado para el texto del comentario en edición

    const handleTextAreaComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    const handleComment = async () => {
        if (!comment.trim()) return;

        const result = await createComment({
            text: comment,
            taskId: task.id,
            userId: (session as Session).user.id,
        });

        const newComment = {
            ...task,
            comments: [...task.comments, result],
        };
        setTask(newComment);
        setComment("");
    };

    // Función para iniciar la edición de un comentario
    const startEditingComment = (commentId: string, commentText: string) => {
        setEditingCommentId(commentId);
        setEditingCommentText(commentText);
    };

    // Función para cancelar la edición
    const cancelEditingComment = () => {
        setEditingCommentId(null);
        setEditingCommentText("");
    };

    // Función para guardar el comentario editado
    const saveEditedComment = async (commentId: string) => {
        if (!editingCommentText.trim()) return;

        const updatedComment = await editComment(commentId, {
            text: editingCommentText,
        });

        const updatedComments = task.comments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
        );

        const updatedTask = {
            ...task,
            comments: updatedComments,
        };

        setTask(updatedTask);
        cancelEditingComment();
    };

    // Función para eliminar un comentario
    const handelDeleteCommnet = async (commentId: string) => {
        await deleteComment(commentId);
        const updatedComments = task.comments.filter(
            (c) => c.id !== commentId
        );
        const updatedTask = {
            ...task,
            comments: updatedComments,
        };
        setTask(updatedTask);
    };
    return (
        <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
                Comentarios
            </label>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {task.comments.map((comment) => (
                    <div
                        key={comment.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700 text-sm">
                                    {comment.user.name}
                                </span>
                                <span className="text-gray-400 text-xs">
                                    {new Date(
                                        comment.createdAt
                                    ).toLocaleDateString("es-ES", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </span>
                            </div>
                            {(session as Session).user.id ===
                                comment.userId && (
                                <div className="flex gap-2">
                                    {editingCommentId === comment.id ? (
                                        <>
                                            <button
                                                onClick={() =>
                                                    saveEditedComment(
                                                        comment.id
                                                    )
                                                }
                                                className="text-green-500 hover:text-green-700 text-sm"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                onClick={cancelEditingComment}
                                                className="text-gray-500 hover:text-gray-700 text-sm"
                                            >
                                                Cancelar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() =>
                                                    startEditingComment(
                                                        comment.id,
                                                        comment.text
                                                    )
                                                }
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 text-sm"
                                                onClick={() =>
                                                    setModalDelete({
                                                        idComment: comment.id,
                                                        modalOpen: true,
                                                    })
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        {editingCommentId === comment.id ? (
                            <textarea
                                value={editingCommentText}
                                onChange={(e) =>
                                    setEditingCommentText(e.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        ) : (
                            <p className="text-gray-600 text-sm">
                                {comment.text}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex gap-3">
                <textarea
                    value={comment}
                    onChange={handleTextAreaComment}
                    placeholder="Escribe un comentario..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                />
                <button
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="self-start px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Enviar
                </button>
            </div>
            {/* Modal de confirmación para eliminar comentario */}
            {modalDelete.modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handelDeleteCommnet(modalDelete.idComment);
                    setModalDelete({ idComment: "", modalOpen: false });
                    }
                }}
                tabIndex={0} >
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-lg font-semibold text-gray-700">
                            ¿Estás seguro de eliminar este comentario?
                            </h2>
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setModalDelete({ idComment: "", modalOpen: false })}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            
                            >
                                Cancelar
                                </button>
                            <button
                                onClick={() => {
                                  
                                    handelDeleteCommnet(modalDelete.idComment);
                                    setModalDelete({ idComment: "", modalOpen: false });
                                }}
                               
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Estoy seguro, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskComments;
