import { h, render, ComponentChildren } from "preact";
import { jsx } from "preact/jsx-runtime";

type StreamedProps = Record<string, any> & {
	children: StreamedChild | StreamedChild[];
};
type StreamedChild =
	| string
	| number
	| null
	| ["$", string, null | string | number, StreamedProps];

type StreamedVNode = StreamedChild | StreamedChild[];

function toVNode(input: StreamedVNode): ComponentChildren {
	if (Array.isArray(input) && input.length > 0) {
		if (Array.isArray(input[0])) {
			return input.map((v: any) => toVNode(v));
		} else if (input[0] === "$") {
			const type = input[1] as string;
			const key = input[2] as any;
			const props = { ...(input[3] as any) };
			if ("children" in props) {
				props.children = toVNode(props.children);
			}
			return jsx(type, props, key);
		}
	}

	return input;
}

export function parse(input: object) {
	const commands = Object.keys(input);

	// TODO: Add support for adding script tags
	commands.forEach(cmd => {
		const data = input[cmd];

		switch (cmd[0]) {
			case "J": {
				const vnode = toVNode(data);
				const selector = `[data-root="${cmd}"]`;
				const root = document.querySelector(selector);

				if (!root) {
					throw new Error(`No element found with selector ${selector}`);
				}

				render(vnode, root);
				break;
			}
			default:
				throw new Error(`Unknown type: ${cmd}`);
		}
	});
}
