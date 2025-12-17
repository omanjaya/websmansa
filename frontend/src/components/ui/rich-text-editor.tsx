'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Quote,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Link2,
    Image as ImageIcon,
    Youtube as YoutubeIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
} from 'lucide-react'
import { useCallback, useState } from 'react'

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    placeholder?: string
}

export function RichTextEditor({ content, onChange, placeholder = 'Tulis konten di sini...' }: RichTextEditorProps) {
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [showImageInput, setShowImageInput] = useState(false)
    const [imageUrl, setImageUrl] = useState('')
    const [showYoutubeInput, setShowYoutubeInput] = useState(false)
    const [youtubeUrl, setYoutubeUrl] = useState('')

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Youtube.configure({
                width: 640,
                height: 360,
            }),
        ],
        content,
        immediatelyRender: false, // Fix SSR hydration mismatch
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] max-w-none p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addImage = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setShowImageInput(false)
        }
    }, [editor, imageUrl])

    const setLink = useCallback(() => {
        if (linkUrl && editor) {
            editor.chain().focus().setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setShowLinkInput(false)
        }
    }, [editor, linkUrl])

    const addYoutube = useCallback(() => {
        if (youtubeUrl && editor) {
            editor.commands.setYoutubeVideo({ src: youtubeUrl })
            setYoutubeUrl('')
            setShowYoutubeInput(false)
        }
    }, [editor, youtubeUrl])

    if (!editor) {
        return null
    }

    return (
        <div className="border border-gray-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
            {/* Toolbar */}
            <div className="border-b border-gray-300 dark:border-slate-600 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-slate-700">
                {/* Text Formatting */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Bold"
                >
                    <Bold className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Italic"
                >
                    <Italic className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('underline') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Underline"
                >
                    <UnderlineIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Headings */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Heading 1"
                >
                    <Heading1 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Heading 2"
                >
                    <Heading2 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Heading 3"
                >
                    <Heading3 className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Bullet List"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Numbered List"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Alignment */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Align Left"
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Align Center"
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Align Right"
                >
                    <AlignRight className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Extras */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Quote"
                >
                    <Quote className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600 ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-slate-600' : ''
                        }`}
                    title="Code Block"
                >
                    <Code className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Media */}
                <button
                    type="button"
                    onClick={() => setShowLinkInput(!showLinkInput)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                    title="Add Link"
                >
                    <Link2 className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setShowImageInput(!showImageInput)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                    title="Add Image"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => setShowYoutubeInput(!showYoutubeInput)}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                    title="Embed YouTube"
                >
                    <YoutubeIcon className="w-4 h-4" />
                </button>

                <div className="w-px h-8 bg-gray-300 dark:bg-slate-600 mx-1" />

                {/* Undo/Redo */}
                <button
                    type="button"
                    onClick={() => editor.chain().focus().undo().run()}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                    title="Undo"
                >
                    <Undo className="w-4 h-4" />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().redo().run()}
                    className="p-2 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                    title="Redo"
                >
                    <Redo className="w-4 h-4" />
                </button>
            </div>

            {/* Link Input */}
            {showLinkInput && (
                <div className="p-3 bg-gray-100 dark:bg-slate-700 border-b border-gray-300 dark:border-slate-600 flex gap-2">
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setLink())}
                    />
                    <button
                        type="button"
                        onClick={setLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tambah
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowLinkInput(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-slate-600 rounded-lg hover:bg-gray-400"
                    >
                        Batal
                    </button>
                </div>
            )}

            {/* Image Input */}
            {showImageInput && (
                <div className="p-3 bg-gray-100 dark:bg-slate-700 border-b border-gray-300 dark:border-slate-600 flex gap-2">
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <button
                        type="button"
                        onClick={addImage}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tambah
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowImageInput(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-slate-600 rounded-lg hover:bg-gray-400"
                    >
                        Batal
                    </button>
                </div>
            )}

            {/* YouTube Input */}
            {showYoutubeInput && (
                <div className="p-3 bg-gray-100 dark:bg-slate-700 border-b border-gray-300 dark:border-slate-600 flex gap-2">
                    <input
                        type="url"
                        value={youtubeUrl}
                        onChange={(e) => setYoutubeUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 dark:text-white"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addYoutube())}
                    />
                    <button
                        type="button"
                        onClick={addYoutube}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Tambah
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowYoutubeInput(false)}
                        className="px-4 py-2 bg-gray-300 dark:bg-slate-600 rounded-lg hover:bg-gray-400"
                    >
                        Batal
                    </button>
                </div>
            )}

            {/* Editor Content */}
            <EditorContent editor={editor} className="dark:text-white" />
        </div>
    )
}
