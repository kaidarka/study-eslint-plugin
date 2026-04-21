/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: "module",
  },
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      code: "import { ArticleCard } from '../ui/ArticleCard';",
      filename: String.raw`C:\project\src\entities\Article\model\selectors.js`,
      options: [],
    },
    {
      code: "import { CommentList } from 'entities/Comment';",
      filename: String.raw`C:\project\src\entities\Article\model\selectors.js`,
      options: [],
    },
    {
      code: "import { MainPage } from 'pages/MainPage';",
      filename: String.raw`C:\project\src\features\AuthByUsername\model\service.js`,
      options: [],
    },
    {
      code: "import { something } from 'app/providers/StoreProvider';",
      filename: String.raw`C:\project\src\entities\Article\model\selectors.js`,
      options: [],
    },
    {
      code: "import { MainPage } from 'pages/MainPage';",
      filename: "/home/user/project/src/features/AuthByUsername/model/service.js",
      options: [],
    },
    {
      code: "import { CommentList } from 'entities/Comment';",
      filename: "/Users/user/project/src/entities/Article/model/selectors.js",
      options: [],
    },
  ],

  invalid: [
    {
      code: "import { ArticleDetails } from 'entities/Article';",
      filename: String.raw`C:\project\src\entities\Article\model\selectors.js`,
      errors: [{ messageId: "path-not-valid" }],
      options: [],
    },
    {
      code: "import { ArticleDetails } from 'entities/Article';",
      filename: "/home/user/project/src/entities/Article/model/selectors.js",
      errors: [{ messageId: "path-not-valid" }],
      options: [],
    },
    {
      code: "import { ArticleDetails } from '@/entities/Article';",
      filename: "/home/user/project/src/entities/Article/model/selectors.js",
      errors: [{ messageId: "path-not-valid" }],
      options: [{ alias: '@' }],
    },
    {
      code: "import { ArticleDetails } from 'entities/Article';",
      filename: "/Users/user/project/src/entities/Article/model/selectors.js",
      errors: [{ messageId: "path-not-valid" }],
      options: [],
    },
  ],
});
