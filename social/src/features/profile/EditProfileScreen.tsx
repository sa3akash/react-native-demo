import React, { useState, memo } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import {
  Typography,
  Input,
  TextArea,
  Button,
  Card,
  Select,
} from '../../shared/components';
import { useAuthStore, WorkExperience, EducationItem, SocialLinks } from '../../store/useAuthStore';
import { useToast } from '../../shared/components/molecules/Toast';

export interface EditProfileScreenProps {
  onBack: () => void;
  onSaveSuccess?: () => void;
}

const EditProfileScreenComponent: React.FC<EditProfileScreenProps> = ({
  onBack,
  onSaveSuccess,
}) => {
  const { colors, theme } = useTheme();
  const { user, updateProfile } = useAuthStore();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [headline, setHeadline] = useState(user?.headline || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [coverUrl, setCoverUrl] = useState(user?.coverUrl || '');

  // Skills
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkillText, setNewSkillText] = useState('');

  // Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(user?.socialLinks || {});

  // Work History
  const [workHistory, setWorkHistory] = useState<WorkExperience[]>(user?.workHistory || []);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newPeriod, setNewPeriod] = useState('');

  // Education
  const [education, setEducation] = useState<EducationItem[]>(user?.education || []);
  const [newSchool, setNewSchool] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newYear, setNewYear] = useState('');

  const [isSaving, setIsSaving] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    if (!skills.includes(newSkillText.trim())) {
      setSkills([...skills, newSkillText.trim()]);
    }
    setNewSkillText('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleAddWork = () => {
    if (!newCompany.trim() || !newRole.trim()) {
      showToast({ message: 'Please enter company and role.', type: 'warning' });
      return;
    }
    const item: WorkExperience = {
      id: `work_${Date.now()}`,
      company: newCompany.trim(),
      role: newRole.trim(),
      period: newPeriod.trim() || 'Present',
    };
    setWorkHistory([item, ...workHistory]);
    setNewCompany('');
    setNewRole('');
    setNewPeriod('');
  };

  const handleRemoveWork = (id: string) => {
    setWorkHistory(workHistory.filter((w) => w.id !== id));
  };

  const handleAddEducation = () => {
    if (!newSchool.trim() || !newDegree.trim()) {
      showToast({ message: 'Please enter school and degree.', type: 'warning' });
      return;
    }
    const item: EducationItem = {
      id: `edu_${Date.now()}`,
      school: newSchool.trim(),
      degree: newDegree.trim(),
      year: newYear.trim() || '2026',
    };
    setEducation([item, ...education]);
    setNewSchool('');
    setNewDegree('');
    setNewYear('');
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter((e) => e.id !== id));
  };

  const handleSave = () => {
    setIsSaving(true);
    updateProfile({
      name,
      username,
      headline,
      bio,
      location,
      website,
      avatarUrl,
      coverUrl,
      skills,
      socialLinks,
      workHistory,
      education,
      contactInfo: {
        email: user?.email || '',
        phone: user?.phoneNumber,
        location,
        website,
      },
    });
    setIsSaving(false);
    showToast({ message: 'Profile updated successfully! ✨', type: 'success' });
    onSaveSuccess?.();
    onBack();
  };

  const handleChangeAvatar = () => {
    showToast({ message: 'Media picker opened for profile avatar.', type: 'info' });
  };

  const handleChangeCover = () => {
    showToast({ message: 'Media picker opened for cover photo.', type: 'info' });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle, backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn} accessible={true} accessibilityRole="button">
          <Typography variant="body1" color={colors.textSecondary}>
            Cancel
          </Typography>
        </TouchableOpacity>
        <Typography variant="h4" color={colors.text} bold>
          Edit Profile
        </Typography>
        <TouchableOpacity onPress={handleSave} style={styles.saveBtn} accessible={true} accessibilityRole="button">
          <Typography variant="subtitle2" color={colors.primary} bold>
            {isSaving ? 'Saving...' : 'Save'}
          </Typography>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Media Covers & Avatar */}
          <View style={styles.mediaSection}>
            <TouchableOpacity activeOpacity={0.8} onPress={handleChangeCover} style={styles.coverWrapper}>
              <Image source={{ uri: coverUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200' }} style={styles.coverImage} />
              <View style={styles.coverOverlayBadge}>
                <Typography variant="caption" color="#FFFFFF" bold>
                  📷 Change Cover
                </Typography>
              </View>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.8} onPress={handleChangeAvatar} style={styles.avatarWrapper}>
              <Image source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400' }} style={styles.avatarImage} />
              <View style={[styles.avatarOverlayBadge, { backgroundColor: colors.primary }]}>
                <Typography variant="caption" color="#FFFFFF" bold>
                  📷
                </Typography>
              </View>
            </TouchableOpacity>
          </View>

          {/* Basic Info */}
          <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
              Basic Information
            </Typography>
            <Input label="Full Name" value={name} onChangeText={setName} />
            <Input label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
            <Input label="Professional Headline" value={headline} onChangeText={setHeadline} placeholder="e.g. Senior Principal Engineer" />
            <TextArea label="Bio" value={bio} onChangeText={setBio} maxLength={280} placeholder="Tell your network about yourself..." />
            <Input label="Location" value={location} onChangeText={setLocation} placeholder="e.g. San Francisco, CA" />
            <Input label="Website" value={website} onChangeText={setWebsite} placeholder="https://example.com" autoCapitalize="none" />
          </Card>

          {/* Skills Management */}
          <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
              Skills & Endorsements
            </Typography>
            <View style={styles.addSkillRow}>
              <View style={{ flex: 1 }}>
                <Input placeholder="Add a skill (e.g. React Native, WebRTC)" value={newSkillText} onChangeText={setNewSkillText} />
              </View>
              <Button label="Add" size="sm" variant="primary" onPress={handleAddSkill} style={styles.addBtn} />
            </View>
            <View style={styles.skillChipsWrap}>
              {skills.map((skill) => (
                <View key={skill} style={[styles.skillChip, { backgroundColor: colors.inputBg, borderColor: colors.borderSubtle }]}>
                  <Typography variant="caption" color={colors.text} bold>
                    {skill}
                  </Typography>
                  <TouchableOpacity onPress={() => handleRemoveSkill(skill)} style={styles.removeChipBtn}>
                    <Typography variant="caption" color={colors.danger} bold>
                      ✕
                    </Typography>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </Card>

          {/* Social Links */}
          <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
              Social Links
            </Typography>
            <Input label="GitHub URL" placeholder="https://github.com/username" value={socialLinks.github || ''} onChangeText={(t) => setSocialLinks({ ...socialLinks, github: t })} autoCapitalize="none" />
            <Input label="Twitter / X URL" placeholder="https://x.com/username" value={socialLinks.twitter || ''} onChangeText={(t) => setSocialLinks({ ...socialLinks, twitter: t })} autoCapitalize="none" />
            <Input label="LinkedIn URL" placeholder="https://linkedin.com/in/username" value={socialLinks.linkedin || ''} onChangeText={(t) => setSocialLinks({ ...socialLinks, linkedin: t })} autoCapitalize="none" />
            <Input label="YouTube URL" placeholder="https://youtube.com/@channel" value={socialLinks.youtube || ''} onChangeText={(t) => setSocialLinks({ ...socialLinks, youtube: t })} autoCapitalize="none" />
          </Card>

          {/* Work History */}
          <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
              Work Experience
            </Typography>
            <View style={styles.addFormRow}>
              <Input label="Company" placeholder="e.g. Meta" value={newCompany} onChangeText={setNewCompany} />
              <Input label="Role" placeholder="e.g. Staff Software Engineer" value={newRole} onChangeText={setNewRole} />
              <Input label="Period" placeholder="e.g. 2022 - Present" value={newPeriod} onChangeText={setNewPeriod} />
              <Button label="+ Add Experience" size="sm" variant="outline" onPress={handleAddWork} style={{ marginTop: 4 }} />
            </View>

            {workHistory.map((item) => (
              <View key={item.id} style={[styles.historyItemCard, { borderBottomColor: colors.borderSubtle }]}>
                <View style={styles.historyTextCol}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {item.role}
                  </Typography>
                  <Typography variant="caption" color={colors.primary} bold>
                    {item.company} • {item.period}
                  </Typography>
                </View>
                <TouchableOpacity onPress={() => handleRemoveWork(item.id)} style={styles.deleteItemBtn}>
                  <Typography variant="caption" color={colors.danger} bold>
                    Delete
                  </Typography>
                </TouchableOpacity>
              </View>
            ))}
          </Card>

          {/* Education */}
          <Card variant="flat" padding={16} style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
            <Typography variant="subtitle1" color={colors.text} bold style={styles.sectionTitle}>
              Education
            </Typography>
            <View style={styles.addFormRow}>
              <Input label="School / University" placeholder="e.g. Stanford University" value={newSchool} onChangeText={setNewSchool} />
              <Input label="Degree / Field" placeholder="e.g. B.S. in Computer Science" value={newDegree} onChangeText={setNewDegree} />
              <Input label="Graduation Year" placeholder="e.g. 2019" value={newYear} onChangeText={setNewYear} />
              <Button label="+ Add Education" size="sm" variant="outline" onPress={handleAddEducation} style={{ marginTop: 4 }} />
            </View>

            {education.map((item) => (
              <View key={item.id} style={[styles.historyItemCard, { borderBottomColor: colors.borderSubtle }]}>
                <View style={styles.historyTextCol}>
                  <Typography variant="subtitle2" color={colors.text} bold>
                    {item.school}
                  </Typography>
                  <Typography variant="caption" color={colors.textSecondary}>
                    {item.degree} • {item.year}
                  </Typography>
                </View>
                <TouchableOpacity onPress={() => handleRemoveEducation(item.id)} style={styles.deleteItemBtn}>
                  <Typography variant="caption" color={colors.danger} bold>
                    Delete
                  </Typography>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export const EditProfileScreen = memo(EditProfileScreenComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    padding: 6,
  },
  saveBtn: {
    padding: 6,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  mediaSection: {
    position: 'relative',
    marginBottom: 50,
  },
  coverWrapper: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlayBadge: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: -40,
    left: 16,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 37,
  },
  avatarOverlayBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    marginHorizontal: 16,
    marginTop: 12,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  addSkillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addBtn: {
    marginBottom: 6,
  },
  skillChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  removeChipBtn: {
    marginLeft: 6,
    padding: 2,
  },
  addFormRow: {
    marginBottom: 12,
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyTextCol: {
    flex: 1,
  },
  deleteItemBtn: {
    padding: 6,
  },
});
