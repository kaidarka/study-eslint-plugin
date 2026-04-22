/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

const path = require("path");
const { isPathRelative } = require("../helpers");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "test",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
            description: 'Alias for the path',
          },
        },
      }
    ],
    defaultOptions: [{ alias: '' }], // Add a schema if the rule has options
    messages: {
      "path-not-valid": "В рамках модуля пути должны быть относительными",
    }, // Add messageId and message
  },

  create(context) {
    const { alias = "" } = context.options[0] || {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        const normalizedSource = alias ? source.replace(`${alias}/`, "") : source;
        const sourceSegments = normalizedSource.split("/");
        const canAutofix = sourceSegments.length > 2;

        const fromFileName = context.filename;

        if (shouldBeRelative(fromFileName, normalizedSource)) {
          const reportData = {
            node: node,
            messageId: "path-not-valid", 
          };

          if (canAutofix) {
            reportData.fix = (fixer) => {
              const normalizedPath = getNormalizedFilePath(fromFileName).split("/").slice(0, -1).join("/");
              let relaticePath = path.relative(normalizedPath, `/${normalizedSource}`).split("\\").join("/");

              if (!relaticePath.startsWith(".")) {
                relaticePath = `./${relaticePath}`;
              }

              if (relaticePath === "..") {
                relaticePath = "../";
              }

              return fixer.replaceText(node.source, `'${relaticePath}'`);
            };
          }

          context.report(reportData);
        }
      },
    };
  },
};

const layers = {
  'entities': 'entities',
  'features': 'features',
  'pages': 'pages',
  'shared': 'shared',
  'widgets': 'widgets',
};

function getNormalizedFilePath(filePath) {
  const normalizedPath = filePath.split("\\").join("/");
  const projectFrom = normalizedPath.split("src")[1];

  if (!projectFrom) {
    return "";
  }

  return projectFrom;
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split("/");
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const projectFrom = getNormalizedFilePath(from);

  if (!projectFrom) {
    return false;
  }

  const fromArray = projectFrom.split('/');
  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromLayer === toLayer && fromSlice === toSlice;
}
