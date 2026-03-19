"use client";
import styles from '../styles/editorview.module.scss';
import {useState, useCallback} from 'react';
import {createEditor, BaseEditor, Editor, Descendant } from 'slate';
import {Slate, Editable, withReact, ReactEditor} from 'slate-react';

type CustomElement = {
  type: "paragraph";
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}


declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start creating here...' }],
  },
]



export default function EditorView() {
  const [editor] = useState(() => withReact(createEditor()))

  const renderLeaf = useCallback((props: any) => {
  return <Leaf {...props} />;
}, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>MuMuNote says "hello, world!"</h1>
      <br/>
      <Slate editor={editor} initialValue={initialValue}>
        <Editable 
        className={styles.textEditor}
        renderLeaf={renderLeaf}
        //Define a new handler which prints the key that was pressed
        onKeyDown={event => {
          if (event.key === '&') {
            // Prevent the ampersand character from being inserted.
            event.preventDefault()
            // Execute the `insertText` method when the event occurs.
            editor.insertText('and ')
          } else if (event.key === '.') {
            event.preventDefault()
            editor.insertText('.  ')
          } else if (event.ctrlKey && event.key === 'b') {
            event.preventDefault()
            const boldIsActive = Editor.marks(editor)?.bold === true;
            if (boldIsActive) {
              Editor.removeMark(editor, "bold");
            } else {
              Editor.addMark(editor, 'bold', true)
            }
          } else if (event.ctrlKey && event.key === 'i') {
            event.preventDefault();
            const italicIsActive = Editor.marks(editor)?.italic === true;
            if (italicIsActive) {
              Editor.removeMark(editor, "italic");
            } else {
              Editor.addMark(editor, 'italic', true)
            }
          } else if (event.ctrlKey && event.key === 'u') {
            event.preventDefault();
            const underlineIsActive = Editor.marks(editor)?.underline === true;
            if (underlineIsActive) {
              Editor.removeMark(editor, "underline");
            } else {
              Editor.addMark(editor, 'underline', true)
            }
          }
        }}
        />
      </Slate>
    </div>
  );
}

const Leaf = (props: any) => {
  return (
    <span
      {...props.attributes}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal", 
        fontStyle: props.leaf.italic ? "italic" : "normal",
        textDecoration: props.leaf.underline ? "underline" : "none"
      }}
    >
      {props.children}
    </span>
  )
}