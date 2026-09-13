import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { zustandMMKVStorage } from '../core/storage/StorageService';
import { eventBus } from '../core/events/EventBus';

export type GroupPrivacy = 'public' | 'private' | 'secret';
export type GroupMemberRole = 'admin' | 'moderator' | 'member';

export interface GroupRule {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  role: GroupMemberRole;
  joinedAt: string;
  isMuted?: boolean;
}

export interface MembershipRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userBio: string;
  appliedAt: string;
  answers?: Record<string, string>;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: GroupMemberRole;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  isPinned?: boolean;
}

export interface GroupModel {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  category: string;
  privacy: GroupPrivacy;
  requiresApproval: boolean;
  membersCount: number;
  isMember: boolean;
  userRole?: GroupMemberRole;
  rules: GroupRule[];
  members: GroupMember[];
  pendingRequests: MembershipRequest[];
  screeningQuestions: string[];
  posts: GroupPost[];
}

interface GroupState {
  groups: GroupModel[];
  selectedGroupId: string | null;

  setSelectedGroupId: (id: string | null) => void;
  createGroup: (params: {
    name: string;
    description: string;
    avatarUrl?: string;
    coverUrl?: string;
    category: string;
    privacy: GroupPrivacy;
    requiresApproval: boolean;
    rules?: GroupRule[];
    screeningQuestions?: string[];
  }) => string;

  joinGroup: (groupId: string, answers?: Record<string, string>) => void;
  leaveGroup: (groupId: string) => void;
  approveMembershipRequest: (groupId: string, requestId: string) => void;
  declineMembershipRequest: (groupId: string, requestId: string) => void;
  assignMemberRole: (groupId: string, memberId: string, role: GroupMemberRole) => void;
  removeMember: (groupId: string, memberId: string) => void;
  muteMember: (groupId: string, memberId: string, isMuted: boolean) => void;
  updateGroupRules: (groupId: string, rules: GroupRule[]) => void;
  updateGroupSettings: (
    groupId: string,
    settings: {
      name?: string;
      description?: string;
      privacy?: GroupPrivacy;
      requiresApproval?: boolean;
      screeningQuestions?: string[];
    }
  ) => void;
  createGroupPost: (groupId: string, content: string, mediaUrl?: string) => void;
  togglePinPost: (groupId: string, postId: string) => void;
}

const INITIAL_GROUPS: GroupModel[] = [
  {
    id: 'grp_1',
    name: 'React Native Architecture Masters ⚛️',
    description: 'High-performance React Native architecture, Fabric TurboModules, C++ JSI bindings, and enterprise best practices.',
    avatarUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    category: 'Software Engineering',
    privacy: 'public',
    requiresApproval: false,
    membersCount: 38400,
    isMember: true,
    userRole: 'admin',
    screeningQuestions: ['What is your primary experience level with React Native?'],
    rules: [
      {
        id: 'r_1',
        order: 1,
        title: 'Be Respectful & Constructive',
        description: 'Engage respectfully in all code reviews, benchmark debates, and architectural discussions.',
      },
      {
        id: 'r_2',
        order: 2,
        title: 'No Spam or Low-Effort Promotions',
        description: 'Only share well-researched engineering articles, open-source repositories, and technical questions.',
      },
      {
        id: 'r_3',
        order: 3,
        title: 'Share Reproducible Benchmarks',
        description: 'Always include testing device specifications, memory graphs, and flame chart metrics.',
      },
    ],
    members: [
      {
        id: 'usr_meta_998',
        name: 'Alex Rivera',
        username: 'alex.rivera',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        role: 'admin',
        joinedAt: 'Jan 2026',
      },
      {
        id: 'usr_1',
        name: 'Sarah Jenkins',
        username: 'sarah.jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        role: 'moderator',
        joinedAt: 'Feb 2026',
      },
      {
        id: 'usr_2',
        name: 'David Chen',
        username: 'david.chen',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        role: 'member',
        joinedAt: 'Mar 2026',
      },
    ],
    pendingRequests: [
      {
        id: 'req_1',
        userId: 'usr_4',
        userName: 'Michael Zhang',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        userBio: 'Senior iOS/Android Engineer @ Uber • Specializing in Metal rendering',
        appliedAt: '2h ago',
        answers: {
          'What is your primary experience level with React Native?': '6+ years building Tier 1 enterprise production apps.',
        },
      },
      {
        id: 'req_2',
        userId: 'usr_5',
        userName: 'Priya Sharma',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        userBio: 'Compiler Engineer • LLVM & JSI contributor',
        appliedAt: '5h ago',
        answers: {
          'What is your primary experience level with React Native?': 'Wrote custom Hermes bytecode compiler optimizations.',
        },
      },
    ],
    posts: [
      {
        id: 'gp_1',
        groupId: 'grp_1',
        authorId: 'usr_meta_998',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
        authorRole: 'admin',
        content: '📌 Welcome to the Architecture Guild! Please review our benchmark guidelines before posting.',
        createdAt: '1d ago',
        likesCount: 342,
        commentsCount: 28,
        isPinned: true,
      },
      {
        id: 'gp_2',
        groupId: 'grp_1',
        authorId: 'usr_1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        authorRole: 'moderator',
        content: 'Zero-copy ArrayBuffer sharing between C++ TurboModules and JS achieved sub-1ms serialization for 50MB tensors! 🚀',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
        createdAt: '3h ago',
        likesCount: 184,
        commentsCount: 19,
      },
    ],
  },
  {
    id: 'grp_2',
    name: 'DeepMind Edge AI & Neural Models 🧠',
    description: 'Private research group for autonomous agentic reasoning, on-device INT8 quantization, and diffusion transformers.',
    avatarUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    category: 'Artificial Intelligence',
    privacy: 'private',
    requiresApproval: true,
    membersCount: 14200,
    isMember: false,
    screeningQuestions: ['What is your primary research focus in deep learning?'],
    rules: [
      {
        id: 'r_4',
        order: 1,
        title: 'Confidentiality & Pre-Print Ethics',
        description: 'Do not leak embargoed pre-prints or proprietary internal benchmarks.',
      },
    ],
    members: [],
    pendingRequests: [],
    posts: [],
  },
  {
    id: 'grp_3',
    name: 'Stealth AI Autonomous Agents Syndicate 🕵️',
    description: 'Secret invite-only working group for stealth robotics and synthetic intelligence founders.',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
    coverUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
    category: 'Robotics & AI',
    privacy: 'secret',
    requiresApproval: true,
    membersCount: 420,
    isMember: true,
    userRole: 'member',
    screeningQuestions: [],
    rules: [],
    members: [],
    pendingRequests: [],
    posts: [],
  },
];

export const useGroupStore = create<GroupState>()(
  persist(
    (set, get) => ({
      groups: INITIAL_GROUPS,
      selectedGroupId: null,

      setSelectedGroupId: (id) => set({ selectedGroupId: id }),

      createGroup: ({
        name,
        description,
        avatarUrl = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
        coverUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        category,
        privacy,
        requiresApproval,
        rules = [],
        screeningQuestions = [],
      }) => {
        const id = `grp_${Date.now()}`;
        const newGroup: GroupModel = {
          id,
          name,
          description,
          avatarUrl,
          coverUrl,
          category,
          privacy,
          requiresApproval,
          membersCount: 1,
          isMember: true,
          userRole: 'admin',
          rules,
          screeningQuestions,
          members: [
            {
              id: 'usr_meta_998',
              name: 'Alex Rivera',
              username: 'alex.rivera',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
              role: 'admin',
              joinedAt: 'Just now',
            },
          ],
          pendingRequests: [],
          posts: [],
        };

        set(
          produce((state: GroupState) => {
            state.groups.unshift(newGroup);
          })
        );

        eventBus.emit('FEED:POST_CREATED', { postId: id, authorId: 'usr_meta_998' });
        return id;
      },

      joinGroup: (groupId, answers) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (!grp) return;

            if (grp.requiresApproval) {
              const reqId = `req_${Date.now()}`;
              grp.pendingRequests.push({
                id: reqId,
                userId: 'usr_meta_998',
                userName: 'Alex Rivera',
                userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                userBio: 'Staff Platform Architect',
                appliedAt: 'Just now',
                answers,
              });
            } else {
              grp.isMember = true;
              grp.userRole = 'member';
              grp.membersCount += 1;
              grp.members.push({
                id: 'usr_meta_998',
                name: 'Alex Rivera',
                username: 'alex.rivera',
                avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
                role: 'member',
                joinedAt: 'Just now',
              });
            }
          })
        );
      },

      leaveGroup: (groupId) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp && grp.isMember) {
              grp.isMember = false;
              grp.userRole = undefined;
              grp.membersCount = Math.max(0, grp.membersCount - 1);
              grp.members = grp.members.filter((m) => m.id !== 'usr_meta_998');
            }
          })
        );
      },

      approveMembershipRequest: (groupId, requestId) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (!grp) return;

            const reqIndex = grp.pendingRequests.findIndex((r) => r.id === requestId);
            if (reqIndex > -1) {
              const req = grp.pendingRequests[reqIndex];
              grp.pendingRequests.splice(reqIndex, 1);

              grp.membersCount += 1;
              grp.members.push({
                id: req.userId,
                name: req.userName,
                username: req.userName.toLowerCase().replace(/\s+/g, '.'),
                avatarUrl: req.userAvatar,
                role: 'member',
                joinedAt: 'Just now',
              });

              if (req.userId === 'usr_meta_998') {
                grp.isMember = true;
                grp.userRole = 'member';
              }
            }
          })
        );
      },

      declineMembershipRequest: (groupId, requestId) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              grp.pendingRequests = grp.pendingRequests.filter((r) => r.id !== requestId);
            }
          })
        );
      },

      assignMemberRole: (groupId, memberId, role) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              const mem = grp.members.find((m) => m.id === memberId);
              if (mem) {
                mem.role = role;
                if (memberId === 'usr_meta_998') {
                  grp.userRole = role;
                }
              }
            }
          })
        );
      },

      removeMember: (groupId, memberId) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              grp.members = grp.members.filter((m) => m.id !== memberId);
              grp.membersCount = Math.max(0, grp.membersCount - 1);
            }
          })
        );
      },

      muteMember: (groupId, memberId, isMuted) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              const mem = grp.members.find((m) => m.id === memberId);
              if (mem) {
                mem.isMuted = isMuted;
              }
            }
          })
        );
      },

      updateGroupRules: (groupId, rules) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              grp.rules = rules;
            }
          })
        );
      },

      updateGroupSettings: (groupId, settings) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              Object.assign(grp, settings);
            }
          })
        );
      },

      createGroupPost: (groupId, content, mediaUrl) => {
        const id = `gp_${Date.now()}`;
        const newPost: GroupPost = {
          id,
          groupId,
          authorId: 'usr_meta_998',
          authorName: 'Alex Rivera',
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          authorRole: get().groups.find((g) => g.id === groupId)?.userRole || 'member',
          content,
          mediaUrl,
          createdAt: 'Just now',
          likesCount: 0,
          commentsCount: 0,
        };

        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              grp.posts.unshift(newPost);
            }
          })
        );
      },

      togglePinPost: (groupId, postId) => {
        set(
          produce((state: GroupState) => {
            const grp = state.groups.find((g) => g.id === groupId);
            if (grp) {
              const post = grp.posts.find((p) => p.id === postId);
              if (post) {
                post.isPinned = !post.isPinned;
              }
            }
          })
        );
      },
    }),
    {
      name: 'groups-storage',
      storage: createJSONStorage(() => zustandMMKVStorage),
      partialize: (state) => ({
        groups: state.groups,
      }),
    }
  )
);
