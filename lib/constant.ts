import { Jacquard_12 } from "next/font/google";

export const Languages_version = {
    javascript: "18.15.0",
    python: "3.11.5",
    java: "21",
    php: "8.2",
    c: "11",
    r: "4.3.1",
}

export const CODE_SNIPPETS: Record<string, string> = {
  "javascript": `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  "python": `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  "java": `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  "c":'#include <stdio.h>\n\nint  main(void)\n{\n\tprintf("Hello World in C");\n\treturn (0);\n}\n',
  "php": "<?php\n\n$name = 'Alex';\necho $name;\n?>\n",
  "r": `\ngreet <- function(name) {\n\tprint(paste("Hello,", name, "!"))\n}\n\ngreet("Alex")\n`,
};