"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemberMutations } from "@/hooks/members/members.hook";
import { addMemberSchema } from "@/hooks/members/members.schemas";
import { TAddMember } from "@/hooks/members/members.types";
import { ROLE_LABELS } from "@/components/rooms/RoleBadge";
import { getErrorMessage, getErrorStatus } from "@/lib/errors";

const ROLE_OPTIONS = [
  { value: "USER", label: ROLE_LABELS.USER },
  { value: "ADMIN", label: ROLE_LABELS.ADMIN },
];

const getAddMemberError = (error: unknown) => {
  const status = getErrorStatus(error);

  if (status === 404) return "Користувача з таким email не знайдено";
  if (status === 409) return "Цей користувач уже є в кімнаті";

  return getErrorMessage(error);
};

export const AddMemberForm = ({ roomId }: { roomId: string }) => {
  const { add } = useMemberMutations(roomId);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAddMember>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { email: "", role: "USER" },
  });

  const onSubmit = (values: TAddMember) => {
    add.mutate(values, {
      onSuccess: () => {
        toast.success("Учасника додано");
        reset();
      },
      onError: (error) => toast.error(getAddMemberError(error)),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-2"
    >
      <Field data-invalid={!!errors.email}>
        <Input
          type="email"
          placeholder="Email колеги"
          aria-label="Email колеги"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        <FieldError errors={[errors.email]} />
      </Field>

      <div className="flex gap-2">
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              items={ROLE_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="flex-1" aria-label="Роль">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        <Button type="submit" disabled={add.isPending}>
          {add.isPending ? "Додаємо..." : "Додати"}
        </Button>
      </div>
    </form>
  );
};
