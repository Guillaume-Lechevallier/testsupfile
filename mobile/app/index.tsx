import React, { useMemo, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { apiRequest, ApiError } from '../utils/api';
import { setAuthToken } from '../utils/auth';

const brandColor = '#f76c63';
const surfaceColor = '#f7f7f7';
const textColor = '#2d2d2d';

const externalLinks = [
  { label: 'CGU/CGV', url: 'https://example.com/terms' },
  { label: 'Politique de confidentialité', url: 'https://example.com/privacy' },
  { label: 'Copyright SUPFile', url: 'https://example.com/copyright' },
];

function InputField({
  label,
  placeholder,
  secure,
  value,
  onChangeText,
  accessibilityLabel,
}: {
  label: string;
  placeholder: string;
  secure?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  accessibilityLabel: string;
}) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>{label}</Text>
        </View>
        <View style={styles.fieldRow}>
          <TextInput
            style={styles.textInput}
            placeholder={placeholder}
            placeholderTextColor="#7a7a7a"
            secureTextEntry={secure}
            value={value}
            onChangeText={onChangeText}
            accessibilityLabel={accessibilityLabel}
          />
          <MaterialIcons name="chevron-right" size={22} color="#777" />
        </View>
      </View>
    </View>
  );
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isDisabled = useMemo(() => !email || !password, [email, password]);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiRequest<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      setAuthToken(data.token);
      router.push('/files');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de se connecter pour l'instant.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (!normalizedEmail || !normalizedPassword) {
      setError('Veuillez renseigner votre email et votre mot de passe.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await apiRequest<{ token: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, password: normalizedPassword }),
      });
      setAuthToken(data.token);
      router.push('/files');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de créer le compte pour l'instant.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const onExternalLinkPress = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.warn('Impossible d\'ouvrir le lien', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <View style={styles.headerRow}>
          <Pressable style={styles.menuButton} accessibilityLabel="Options de connexion">
            <Ionicons name="ellipsis-horizontal" size={22} color="white" />
          </Pressable>
        </View>

        <View style={styles.logoWrapper}>
          <View style={styles.logoIcon}>
            <Ionicons name="cloud-upload-outline" size={44} color="white" />
          </View>
          <Text style={styles.logoText}>SUPFile</Text>
        </View>

        <Text style={styles.sectionTitle}>Se connecter avec</Text>

        <InputField
          label="Courriel"
          placeholder="Votre adresse email"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Adresse email"
        />

        <InputField
          label="Mot de passe"
          placeholder="Votre mot de passe"
          secure
          value={password}
          onChangeText={setPassword}
          accessibilityLabel="Mot de passe"
        />

        <Pressable
          style={[styles.primaryButton, isDisabled && styles.primaryButtonDisabled]}
          disabled={isDisabled || isLoading}
          accessibilityLabel="Connexion"
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>{isLoading ? 'Connexion…' : 'Connexion'}</Text>
        </Pressable>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.orText}>Ou avec</Text>

        <Pressable style={styles.googleButton} accessibilityLabel="Connexion avec Google">
          <View style={styles.googleContent}>
            <FontAwesome name="google" size={20} color="#4285F4" />
            <Text style={styles.googleText}>Votre compte Google</Text>
          </View>
          <MaterialIcons name="chevron-right" size={22} color="#777" />
        </Pressable>

        <View style={styles.signupRow}>
          <Text style={styles.signupPrompt}>Vous n'avez pas de compte ?</Text>
          <Pressable accessibilityLabel="S'inscrire" onPress={handleRegister} disabled={isDisabled || isLoading}>
            <Text style={styles.signupLink}>S'inscrire</Text>
          </Pressable>
        </View>

        <View style={styles.socialBar}>
          <View style={styles.socialLeft}>
            <FontAwesome name="facebook-square" size={22} color="white" />
            <FontAwesome name="instagram" size={22} color="white" style={styles.socialIcon} />
            <FontAwesome name="youtube-play" size={22} color="white" />
          </View>
          <View style={styles.socialRight}>
            {externalLinks.map((item) => (
              <Pressable key={item.label} onPress={() => onExternalLinkPress(item.url)}>
                <Text style={styles.socialLink}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: brandColor,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: brandColor,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  menuButton: {
    backgroundColor: 'rgba(0,0,0,0.12)',
    height: 38,
    width: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    width: 88,
    height: 88,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#f0f0f0',
    marginVertical: 12,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: 14,
  },
  inputContainer: {
    backgroundColor: surfaceColor,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 12,
    color: '#555',
    fontWeight: '600',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: textColor,
    paddingVertical: 8,
    marginRight: 10,
  },
  primaryButton: {
    backgroundColor: '#444',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    marginTop: 10,
    color: '#ffe3e3',
    textAlign: 'center',
    fontWeight: '600',
  },
  orText: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  googleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleText: {
    fontSize: 15,
    marginLeft: 10,
    color: textColor,
    fontWeight: '600',
  },
  signupRow: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupPrompt: {
    color: '#f0f0f0',
    marginBottom: 4,
  },
  signupLink: {
    color: 'white',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  socialBar: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  socialLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  socialIcon: {
    marginHorizontal: 10,
  },
  socialRight: {
    flex: 1,
    marginLeft: 12,
  },
  socialLink: {
    color: 'white',
    fontSize: 12,
    lineHeight: 18,
  },
});
