// =============================================
// Supabase Database Types for Maher App
// Extended with admin tables (app_settings, notifications)
// =============================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          locale: "ar" | "en";
          role: "user" | "admin";
          push_token: string | null;
          stripe_customer_id: string | null;
          revenuecat_app_user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          locale?: "ar" | "en";
          role?: "user" | "admin";
          push_token?: string | null;
          stripe_customer_id?: string | null;
          revenuecat_app_user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          locale?: "ar" | "en";
          role?: "user" | "admin";
          push_token?: string | null;
          stripe_customer_id?: string | null;
          revenuecat_app_user_id?: string | null;
          updated_at?: string;
        };
      };

      children: {
        Row: {
          id: string;
          parent_id: string;
          name: string;
          age: number;
          age_group: "3-6" | "6-9" | "9-12";
          avatar: string;
          favorite_subjects: string[];
          total_points: number;
          current_streak: number;
          longest_streak: number;
          last_activity_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          name: string;
          age: number;
          age_group: "3-6" | "6-9" | "9-12";
          avatar?: string;
          favorite_subjects?: string[];
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
        };
        Update: {
          name?: string;
          age?: number;
          age_group?: "3-6" | "6-9" | "9-12";
          avatar?: string;
          favorite_subjects?: string[];
          total_points?: number;
          current_streak?: number;
          longest_streak?: number;
          last_activity_date?: string | null;
        };
      };

      subjects: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string;
          emoji: string;
          color: string;
          icon: string;
          sort_order: number;
          age_groups: string[];
          created_at: string;
        };
        Insert: {
          id: string;
          name_ar: string;
          name_en: string;
          emoji: string;
          color: string;
          icon: string;
          sort_order?: number;
          age_groups?: string[];
        };
        Update: {
          name_ar?: string;
          name_en?: string;
          emoji?: string;
          color?: string;
          icon?: string;
          sort_order?: number;
          age_groups?: string[];
        };
      };

      lessons: {
        Row: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          description_ar: string | null;
          description_en: string | null;
          content: Json;
          duration: number;
          sort_order: number;
          age_group: "3-6" | "6-9" | "9-12";
          is_free: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          description_ar?: string | null;
          description_en?: string | null;
          content: Json;
          duration?: number;
          sort_order?: number;
          age_group: "3-6" | "6-9" | "9-12";
          is_free?: boolean;
        };
        Update: {
          title_ar?: string;
          title_en?: string;
          description_ar?: string | null;
          description_en?: string | null;
          content?: Json;
          duration?: number;
          sort_order?: number;
          age_group?: "3-6" | "6-9" | "9-12";
          is_free?: boolean;
        };
      };

      quizzes: {
        Row: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          questions: Json;
          age_group: "3-6" | "6-9" | "9-12";
          created_at: string;
        };
        Insert: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          questions: Json;
          age_group: "3-6" | "6-9" | "9-12";
        };
        Update: {
          title_ar?: string;
          title_en?: string;
          questions?: Json;
          age_group?: "3-6" | "6-9" | "9-12";
        };
      };

      flashcard_decks: {
        Row: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          cards: Json;
          age_group: "3-6" | "6-9" | "9-12";
          created_at: string;
        };
        Insert: {
          id: string;
          subject_id: string;
          title_ar: string;
          title_en: string;
          cards: Json;
          age_group: "3-6" | "6-9" | "9-12";
        };
        Update: {
          title_ar?: string;
          title_en?: string;
          cards?: Json;
          age_group?: "3-6" | "6-9" | "9-12";
        };
      };

      badges: {
        Row: {
          id: string;
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          emoji: string;
          requirement: string;
          sort_order: number;
        };
        Insert: {
          id: string;
          name_ar: string;
          name_en: string;
          description_ar: string;
          description_en: string;
          emoji: string;
          requirement: string;
          sort_order?: number;
        };
        Update: {
          name_ar?: string;
          name_en?: string;
          description_ar?: string;
          description_en?: string;
          emoji?: string;
          requirement?: string;
          sort_order?: number;
        };
      };

      lesson_completions: {
        Row: {
          id: string;
          child_id: string;
          lesson_id: string;
          subject_id: string;
          time_spent: number;
          points_earned: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          lesson_id: string;
          subject_id: string;
          time_spent?: number;
          points_earned?: number;
        };
        Update: {
          time_spent?: number;
          points_earned?: number;
        };
      };

      quiz_attempts: {
        Row: {
          id: string;
          child_id: string;
          quiz_id: string;
          subject_id: string;
          score: number;
          answers: Json | null;
          time_spent: number;
          attempted_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          quiz_id: string;
          subject_id: string;
          score: number;
          answers?: Json | null;
          time_spent?: number;
        };
        Update: {
          score?: number;
          answers?: Json | null;
          time_spent?: number;
        };
      };

      flashcard_sessions: {
        Row: {
          id: string;
          child_id: string;
          deck_id: string;
          subject_id: string;
          known_count: number;
          review_count: number;
          time_spent: number;
          completed_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          deck_id: string;
          subject_id: string;
          known_count?: number;
          review_count?: number;
          time_spent?: number;
        };
        Update: {
          known_count?: number;
          review_count?: number;
          time_spent?: number;
        };
      };

      daily_progress: {
        Row: {
          id: string;
          child_id: string;
          date: string;
          lessons_completed: number;
          quizzes_taken: number;
          points_earned: number;
          time_spent: number;
        };
        Insert: {
          id?: string;
          child_id: string;
          date?: string;
          lessons_completed?: number;
          quizzes_taken?: number;
          points_earned?: number;
          time_spent?: number;
        };
        Update: {
          lessons_completed?: number;
          quizzes_taken?: number;
          points_earned?: number;
          time_spent?: number;
        };
      };

      badge_unlocks: {
        Row: {
          id: string;
          child_id: string;
          badge_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          child_id: string;
          badge_id: string;
        };
        Update: {};
      };

      subscriptions: {
        Row: {
          id: string;
          parent_id: string;
          plan: "free" | "plus" | "family";
          status: "active" | "cancelled" | "expired";
          starts_at: string;
          expires_at: string | null;
          max_children: number;
          payment_provider: "stripe" | "revenuecat" | "manual" | null;
          external_subscription_id: string | null;
          external_product_id: string | null;
          auto_renew: boolean;
          cancel_at_period_end: boolean;
          current_period_start: string | null;
          current_period_end: string | null;
          trial_end: string | null;
          currency: string;
          price_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          plan?: "free" | "plus" | "family";
          status?: "active" | "cancelled" | "expired";
          max_children?: number;
          payment_provider?: "stripe" | "revenuecat" | "manual" | null;
          external_subscription_id?: string | null;
          external_product_id?: string | null;
          auto_renew?: boolean;
          cancel_at_period_end?: boolean;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_end?: string | null;
          currency?: string;
          price_amount?: number | null;
        };
        Update: {
          plan?: "free" | "plus" | "family";
          status?: "active" | "cancelled" | "expired";
          expires_at?: string | null;
          max_children?: number;
          payment_provider?: "stripe" | "revenuecat" | "manual" | null;
          external_subscription_id?: string | null;
          external_product_id?: string | null;
          auto_renew?: boolean;
          cancel_at_period_end?: boolean;
          current_period_start?: string | null;
          current_period_end?: string | null;
          trial_end?: string | null;
          currency?: string;
          price_amount?: number | null;
          updated_at?: string;
        };
      };

      parent_settings: {
        Row: {
          parent_id: string;
          pin_hash: string | null;
          daily_time_limit: number;
          notifications_enabled: boolean;
          updated_at: string;
        };
        Insert: {
          parent_id: string;
          pin_hash?: string | null;
          daily_time_limit?: number;
          notifications_enabled?: boolean;
        };
        Update: {
          pin_hash?: string | null;
          daily_time_limit?: number;
          notifications_enabled?: boolean;
        };
      };

      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          source: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          source?: string;
        };
        Update: {
          email?: string;
          name?: string | null;
          phone?: string | null;
        };
      };

      app_settings: {
        Row: {
          key: string;
          value: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value?: string | null;
          updated_by?: string | null;
        };
        Update: {
          value?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };

      transactions: {
        Row: {
          id: string;
          parent_id: string;
          subscription_id: string | null;
          payment_provider: "stripe" | "revenuecat" | "apple" | "google";
          external_transaction_id: string | null;
          type: "purchase" | "renewal" | "refund" | "upgrade" | "downgrade";
          status: "pending" | "completed" | "failed" | "refunded";
          amount: number;
          currency: string;
          plan: "plus" | "family";
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          subscription_id?: string | null;
          payment_provider: "stripe" | "revenuecat" | "apple" | "google";
          external_transaction_id?: string | null;
          type: "purchase" | "renewal" | "refund" | "upgrade" | "downgrade";
          status: "pending" | "completed" | "failed" | "refunded";
          amount: number;
          currency?: string;
          plan: "plus" | "family";
          metadata?: Json;
        };
        Update: {
          status?: "pending" | "completed" | "failed" | "refunded";
          metadata?: Json;
        };
      };

      payment_methods: {
        Row: {
          id: string;
          parent_id: string;
          stripe_customer_id: string | null;
          stripe_payment_method_id: string | null;
          card_brand: string | null;
          card_last4: string | null;
          card_exp_month: number | null;
          card_exp_year: number | null;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          stripe_customer_id?: string | null;
          stripe_payment_method_id?: string | null;
          card_brand?: string | null;
          card_last4?: string | null;
          card_exp_month?: number | null;
          card_exp_year?: number | null;
          is_default?: boolean;
        };
        Update: {
          card_brand?: string | null;
          card_last4?: string | null;
          card_exp_month?: number | null;
          card_exp_year?: number | null;
          is_default?: boolean;
        };
      };

      notifications: {
        Row: {
          id: string;
          title: string;
          body: string;
          target: "all" | "free" | "plus" | "family" | "specific";
          target_user_ids: string[];
          status: "draft" | "sent" | "failed";
          sent_count: number;
          created_by: string | null;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          target?: "all" | "free" | "plus" | "family" | "specific";
          target_user_ids?: string[];
          status?: "draft" | "sent" | "failed";
          sent_count?: number;
          created_by?: string | null;
        };
        Update: {
          title?: string;
          body?: string;
          target?: "all" | "free" | "plus" | "family" | "specific";
          target_user_ids?: string[];
          status?: "draft" | "sent" | "failed";
          sent_count?: number;
          sent_at?: string | null;
        };
      };
    };

    Functions: {
      update_streak: {
        Args: { p_child_id: string };
        Returns: void;
      };
      check_and_unlock_badges: {
        Args: { p_child_id: string };
        Returns: void;
      };
      get_child_dashboard: {
        Args: { p_child_id: string };
        Returns: Json;
      };
    };
  };
}
