import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { typography } from '../../styles/typography';
import { MetaAIAvatar } from './MetaAIAvatar';

interface MetaAIFirstTimeScreenProps {
  userName: string;
  onSuggestionPress: (text: string) => void;
}

export const MetaAIFirstTimeScreen: React.FC<MetaAIFirstTimeScreenProps> = ({ 
  userName, 
  onSuggestionPress 
}) => {
  const suggestions = [
    { text: "I want to find info about a topic", icon: "📄" },
    { text: "I want to hear a joke", icon: "📄" },
    { text: "I want to write a message to a coworker", icon: "📄" },
    { text: "I want new music to listen to", icon: "📄" },
  ];

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Large centered gradient icon */}
      <View style={styles.iconContainer}>
        <MetaAIAvatar size={120} />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>
        {getGreeting()}, {userName}
      </Text>

      {/* Suggestion cards */}
      <View style={styles.suggestionsContainer}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionCard}
            onPress={() => onSuggestionPress(suggestion.text)}
            activeOpacity={0.7}
          >
            <Text style={styles.suggestionIcon}>{suggestion.icon}</Text>
            <Text style={styles.suggestionText}>{suggestion.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing['3xl'],
    paddingBottom: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontFamily: typography.fontFamily.medium,
    color: colors.textPrimary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
  suggestionsContainer: {
    width: '100%',
    maxWidth: 400,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  suggestionCard: {
    backgroundColor: colors.white,
    borderRadius: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  suggestionIcon: {
    fontSize: typography.fontSize.lg,
  },
  suggestionText: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: typography.lineHeight.normal * typography.fontSize.base,
  },
});
