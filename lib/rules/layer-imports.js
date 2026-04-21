/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

const path = require("path");
const micromatch = require("micromatch");
const { isPathRelative } = require("../helpers");

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const layers = {
  'app': ['shared', 'entities', 'features', 'widgets', 'pages'],
  'pages': ['shared', 'entities', 'features', 'widgets'],
  'widgets': ['shared', 'entities', 'features'],
  'features': ['shared', 'entities'],
  'entities': ['shared', 'entities'],
  'shared': ['shared'],
};

const availableLayers = {
  app: 'app',
  pages: 'pages',
  widgets: 'widgets',
  features: 'features',
  entities: 'entities',
  shared: 'shared',
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: "problem", // `problem`, `suggestion`, or `layout`
    docs: {
      description: "test",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
            description: 'Alias for the path',
          },
          ignoreImportPatterns: {
            type: 'array',
            description: 'Patterns for ignore imports',
          },
        },
      }
    ],
    defaultOptions: [{ alias: '', ignoreImportPatterns: [] }], // Add a schema if the rule has options
    messages: {
      "layer-imports-not-valid": "Неверный импорт слоя",
    }, // Add messageId and message
  },

  create(context) {
    const { alias, ignoreImportPatterns } = context.options[0] ?? {};

    const getCurrentFileLayer = () => {
      const currentFile = context.filename;
    
      const normalizedPath = path.toNamespacedPath(currentFile);
      const projectFrom = normalizedPath.split("src")[1];
      const segments = projectFrom?.split("/");

      return segments?.[1];
    };

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, "") : value;
      const segments = importPath.split("/");

      return segments?.[0];
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) {
          return;
        }

        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return;
        }

        const isIgnored = ignoreImportPatterns.some(pattern => micromatch.isMatch(importPath, pattern));

        if (isIgnored) {
          return;
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report({node: node, messageId: "layer-imports-not-valid"});
        }

    }
  };
  },
};
