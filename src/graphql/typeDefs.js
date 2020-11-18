module.exports = `
  type Course {
    id: ID!
    title: String!
    createdAt: String!
    username: String!
    link: String!
    website: String!
    cost: Int!
    level: String!
    skills:[String]!
    reviews: [Review]!
    votes: [Vote]!
    voteCount: Int!
    reviewCount: Int!
  }
  type Review {
    id: ID!
    pros: [String]!
    cons: [String]!
    username: String!
    createdAt: String!
  }
  type Vote {
    id: ID!
    username: String!
    createdAt: String!
  }
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
    password: String!
    jwt: Token
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Token {
    token: String!
    expiresIn: String!
  }
  type Query {
    courses: [Course]
    course(courseId: ID!): Course
    user(userId: ID!): User
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(email: String!, password: String!): User!
    logout: String!
    refreshToken: Token!
    createCourse(title: String!, link: String!, skills:[String]!,cost: Int!,level: String!): Course!
    editCourse(courseId:ID!,title: String!, link: String!, skills:[String]!,cost: Int!,level: String!): Course!
    deleteCourse(courseId: ID!): String!
    createReview(courseId: ID!, pros: [String]!, cons:[String]!): Course!
    editReview(courseId: ID!, reviewId:ID!, pros: [String]!, cons:[String]!): Course!
    deleteReview(courseId: ID!, reviewId: ID!): Course!
    voteCourse(courseId: ID!): Course!
  }
`;
