"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/auth/auth.hook";
import { loginSchema } from "@/hooks/auth/auth.schemas";
import { TLoginUser } from "@/hooks/auth/auth.types";
import { getErrorMessage } from "@/lib/errors";

export const LoginForm = () => {
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginUser>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: TLoginUser) => {
    login.mutate(values, {
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Вхід</CardTitle>
        <CardDescription>Увійдіть, щоб бронювати кімнати</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              <FieldError errors={[errors.email]} />
            </Field>

            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor="password">Пароль</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <FieldError errors={[errors.password]} />
            </Field>

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Входимо..." : "Увійти"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Немає акаунту?{" "}
              <Link href="/register" className="text-foreground underline">
                Зареєструватися
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
