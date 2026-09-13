import { useGroupStore } from '../src/store/useGroupStore';

describe('Enterprise Groups & Community Governance Suite', () => {
  beforeEach(() => {
    useGroupStore.setState({
      selectedGroupId: null,
    });
  });

  test('Creates Public, Private, and Secret Groups with membership approval settings', () => {
    // 1. Public group
    const publicId = useGroupStore.getState().createGroup({
      name: 'Full Stack Distributed Systems',
      description: 'Discussions on Kafka, Raft consensus, and microservices',
      category: 'Software Engineering',
      privacy: 'public',
      requiresApproval: false,
    });

    // 2. Private group
    const privateId = useGroupStore.getState().createGroup({
      name: 'Venture Capital & Seed Rounds',
      description: 'Exclusive deal flow discussions',
      category: 'Finance',
      privacy: 'private',
      requiresApproval: true,
      screeningQuestions: ['What is your check size and portfolio?'],
    });

    // 3. Secret group
    const secretId = useGroupStore.getState().createGroup({
      name: 'Stealth BioTech Founders',
      description: 'CRISPR & Synthetic Genomics stealth projects',
      category: 'BioTech',
      privacy: 'secret',
      requiresApproval: true,
    });

    const groups = useGroupStore.getState().groups;
    expect(groups.some((g) => g.id === publicId && g.privacy === 'public')).toBe(true);
    expect(groups.some((g) => g.id === privateId && g.privacy === 'private' && g.requiresApproval)).toBe(true);
    expect(groups.some((g) => g.id === secretId && g.privacy === 'secret')).toBe(true);
  });

  test('Handles membership requests approval and decline workflow', () => {
    const groupId = 'grp_1';

    // Check existing pending request
    const group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    const req = group?.pendingRequests[0];
    expect(req).toBeDefined();

    const initialMembers = group?.members.length || 0;
    const initialRequests = group?.pendingRequests.length || 0;

    // Approve request
    useGroupStore.getState().approveMembershipRequest(groupId, req!.id);
    const updatedGroup = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(updatedGroup?.members.length).toBe(initialMembers + 1);
    expect(updatedGroup?.pendingRequests.length).toBe(initialRequests - 1);
    expect(updatedGroup?.members.some((m) => m.name === req?.userName)).toBe(true);

    // Decline next request
    if (updatedGroup?.pendingRequests[0]) {
      const nextReq = updatedGroup.pendingRequests[0];
      useGroupStore.getState().declineMembershipRequest(groupId, nextReq.id);
      expect(useGroupStore.getState().groups.find((g) => g.id === groupId)?.pendingRequests.length).toBe(
        initialRequests - 2
      );
    }
  });

  test('Manages Admin, Moderator, and Member roles with mute and remove permissions', () => {
    const groupId = 'grp_1';

    // Assign role to Moderator
    useGroupStore.getState().assignMemberRole(groupId, 'usr_2', 'moderator');
    let group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.members.find((m) => m.id === 'usr_2')?.role).toBe('moderator');

    // Mute member
    useGroupStore.getState().muteMember(groupId, 'usr_2', true);
    group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.members.find((m) => m.id === 'usr_2')?.isMuted).toBe(true);

    // Remove member
    const memCount = group?.members.length || 0;
    useGroupStore.getState().removeMember(groupId, 'usr_2');
    group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.members.length).toBe(memCount - 1);
  });

  test('Configures Community Rules and publishes group posts', () => {
    const groupId = 'grp_1';

    // Update rules
    const newRules = [
      { id: 'rule_1', order: 1, title: 'No Harassment', description: 'Be kind to fellow developers' },
      { id: 'rule_2', order: 2, title: 'No Low-Effort Memes', description: 'Keep content technical' },
    ];
    useGroupStore.getState().updateGroupRules(groupId, newRules);
    let group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.rules.length).toBe(2);
    expect(group?.rules[0].title).toBe('No Harassment');

    // Publish post
    useGroupStore.getState().createGroupPost(groupId, 'Excited to announce our new group guidelines! 🚀');
    group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.posts[0].content).toContain('new group guidelines');

    // Toggle Pin Post
    const postId = group!.posts[0].id;
    useGroupStore.getState().togglePinPost(groupId, postId);
    group = useGroupStore.getState().groups.find((g) => g.id === groupId);
    expect(group?.posts.find((p) => p.id === postId)?.isPinned).toBe(true);
  });
});
