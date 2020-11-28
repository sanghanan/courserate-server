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
  type AuthenticatedUser{
    user:User!
    jwt:Token!
  }
  type UserHistory{
    user:User!
    courses:[Course]!
    reviews:[Review]!
  }
  type Query {
    courses: [Course]
    course(courseId: ID!): Course
    user(username: String!): UserHistory
  }
  type Mutation {
    register(registerInput: RegisterInput): AuthenticatedUser!
    login(email: String!, password: String!): AuthenticatedUser!
    logout: String!
    refreshToken: Token!
    createCourse(title: String!, link: String!, skills:[String]!,cost: Int!,level: String!,pros: [String]!, cons:[String]!): Course!
    editCourse(courseId:ID!,title: String!, link: String!, skills:[String]!,cost: Int!,level: String!): Course!
    deleteCourse(courseId: ID!): String!
    createReview(courseId: ID!, pros: [String]!, cons:[String]!): Course!
    editReview(courseId: ID!, reviewId:ID!, pros: [String]!, cons:[String]!): Course!
    deleteReview(courseId: ID!, reviewId: ID!): Course!
    voteCourse(courseId: ID!): Course!
  }
`;
