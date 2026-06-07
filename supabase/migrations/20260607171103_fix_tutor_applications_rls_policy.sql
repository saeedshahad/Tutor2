-- Drop the overly permissive policy
drop policy if exists "applications_insert" on public.tutor_applications;

-- Create a more restrictive policy that ensures users can only create applications with their own email
create policy "applications_insert_own_email" on public.tutor_applications for insert
  to authenticated
  with check (
    email = (select email from auth.users where id = auth.uid())
  );
