/**
 * @fileoverview test
 * @author kaidarka
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
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
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      code: "import { getProfileData } from 'entities/Profile';",
      filename: "/home/user/project/src/features/AuthByUsername/model/selectors/getAuthData.js",
      options: [],
    },
    {
      code: "import { addCommentFormReducer } from 'features/AddCommentForm';",
      filename: "/home/user/project/src/widgets/ArticleDetails/model/slices/articleDetailsPageSlice.js",
      options: [],
    },
    {
      code: "import { ProfileCard } from 'widgets/ProfileCard';",
      filename: "/home/user/project/src/pages/ProfilePage/ui/ProfilePage.jsx",
      options: [],
    },
    {
      code: "import { memo } from 'shared/lib/memo';",
      filename: "/home/user/project/src/entities/Article/model/types/article.js",
      options: [],
    },
    {
      code: "import { getProfileData } from '@/entities/Profile';",
      filename: "/home/user/project/src/features/AuthByUsername/model/selectors/getAuthData.js",
      options: [{ alias: "@" }],
    },
    {
      code: "import { ArticlePage } from 'pages/ArticlePage';",
      filename: "/home/user/project/src/widgets/ArticleDetails/ui/ArticleDetails.jsx",
      options: [{ ignoreImportPatterns: ["pages/**"] }],
    },
    {
      code: "import { helper } from '../lib/helper';",
      filename: "/home/user/project/src/features/AuthByUsername/model/services/loginByUsername.js",
      options: [],
    },
  ],

  invalid: [
    {
      code: "import { loginByUsername } from 'features/AuthByUsername';",
      filename: "/home/user/project/src/entities/Article/model/types/article.js",
      errors: [{ messageId: "layer-imports-not-valid" }],
      options: [],
    },
    {
      code: "import { MainPage } from 'pages/MainPage';",
      filename: "/home/user/project/src/features/AuthByUsername/ui/LoginForm.js",
      errors: [{ messageId: "layer-imports-not-valid" }],
      options: [],
    },
    {
      code: "import { MainPage } from 'pages/MainPage';",
      filename: "/home/user/project/src/widgets/Sidebar/ui/Sidebar.jsx",
      errors: [{ messageId: "layer-imports-not-valid" }],
      options: [],
    },
    {
      code: "import { AppRouter } from 'app/providers/router';",
      filename: "/home/user/project/src/pages/ProfilePage/ui/ProfilePage.jsx",
      errors: [{ messageId: "layer-imports-not-valid" }],
      options: [],
    },
    {
      code: "import { AppRouter } from '@/app/providers/router';",
      filename: "/home/user/project/src/entities/Article/ui/ArticleCard.jsx",
      errors: [{ messageId: "layer-imports-not-valid" }],
      options: [{ alias: "@" }],
    },
  ],
});
