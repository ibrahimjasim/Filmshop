/**
 * Horisontell rad med genreknappar.*/

import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import {colors, radius, spacing} from "../constants/theme";

export default function GenreChips({genres, selectedId, onSelect}) {
    const all = [{id: null, name: 'All'}, ...genres];

    return(
        <ScrollView
        horizontal
        // flexGrow: 0 hindrar en horisontell ScrollView från att sträcka sig på höjden
        style={{flexGrow: 0 }}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        keyboardShouldPersistTaps="handled"
        >
            {all.map((genre)=> {
                const active = genre.id === selectedId;
                return (
                    <Pressable
                    key = {genre.id ?? 'all'}
                    onPress = {() => onSelect(genre.id)}
                    style = {[styles.chip, active && styles.chipActive]}
                    accessibilityRole="button"
                    accessibilityState={{selected: active}}
                    >
                        <Text style={[styles.text, active && styles.textActive]}>{genre.name}

                        </Text>
                    </Pressable>
                )
            })}


        </ScrollView>
    )
}


const styles = StyleSheet.create ({
    row: {paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.sm},
    chip: {
        paddingHorizontal: spacing.md,
        paddingVertical: 7,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {backgroundColor: colors.accent, borderColor: colors.accent},
    text: {color: colors.text, fontSize: 14},
    textActive: {color: colors.accentText, fontWeight: '700'},

});