import graphql from "graphql";
import { ObjectId } from "mongodb";
import Project from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/db/models/Project.js";
import User from "/Users/leaescudie/Desktop/Workspace/Perso_test/CtrlUpServer/app/db/models/User.js";

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    pseudo: { type: GraphQLString },
    email: { type: GraphQLString },
    pwd: { type: GraphQLString },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({ participants: parent.id });
      },
    },
  }),
});

const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    participants: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({
          _id: { $in: parent.participants.map((id) => new ObjectId(id)) },
        });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return User.findById(args.id);
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args) {
        return User.find({});
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find({});
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addProject: {
      type: ProjectType,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        tags: {
          type: new GraphQLNonNull(new GraphQLList(GraphQLString)),
        },
        participants: {
          type: new GraphQLNonNull(new GraphQLList(GraphQLID)),
        },
      },
      resolve(parent, args) {
        let project = new Project({
          name: args.name,
          tags: args.tags,
          participants: args.participants,
        });
        return project.save();
      },
    },
    addUser: {
      type: UserType,
      args: {
        pseudo: {
          type: GraphQLString,
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
        pwd: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parent, args) {
        let user = new User({
          pseudo: args.pseudo,
          email: args.email,
          pwd: args.pwd,
        });
        return user.save();
      },
    },
  },
});
export default new GraphQLSchema({ query: RootQuery, mutation: Mutation });
