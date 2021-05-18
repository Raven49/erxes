export const types = `
    type Forum {
        _id: String!
        title: String
        description: String
    }

    input ForumDoc {
        title: String
        description: String
    }
`;

export const queries = `
    forums: [Forum]
    forumDetail(_id: String!): Forum
    forumsTotalCount: Int
`;

export const mutations = `
    forumsAdd(doc: ForumDoc!): Forum
    forumsEdit(_id: String! doc: ForumDoc): Forum
    forumsRemove(_id: String!): JSON
`;
